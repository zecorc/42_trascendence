import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Chat, Message, User } from "@/typeorm";
import { Repository } from "typeorm";
import { UserService } from "@/users/services/users/user.service";
import * as bcrypt from "bcrypt";
import { Password } from "@/chats/dtos/Password.dto";

const muteTime = 30 * 60 * 1000; //30 minutes

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async getChat(
    chatId: number,
    relations = [] as string[],
    withPassword?: boolean
  ): Promise<Chat> {
    let chat = null;
    if (chatId)
      chat = await this.chatRepository.findOne({
        where: {
          id: chatId,
        },
        relations: relations,
      });

    if (!chat) throw new HttpException("Chat NOT found", HttpStatus.NOT_FOUND);

    if (!withPassword) delete chat.password;
    return chat;
  }

  async createChat(chat: Chat, userId: number): Promise<Chat> {
    const admin = await this.userService.getUser(userId);

    console.log(`createChat -> admin: ${admin.username}`);
    if (chat.name == undefined)
      throw new HttpException("Chat name is mandatory", HttpStatus.BAD_REQUEST);

    chat.name = chat.name.trim();

    let hashedPassword = null;
    if (chat.public == false) {
      {
        if (!chat.password)
          throw new HttpException("Password Required", HttpStatus.BAD_REQUEST);

        if (chat.password.length < 4)
          throw new HttpException(
            "New password too short",
            HttpStatus.BAD_REQUEST
          );
      }

      try {
        hashedPassword = bcrypt.hashSync(chat.password, 10);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
    if (
      await this.chatRepository.findOne({
        where: { name: chat.name },
      })
    ) {
      throw new HttpException("Chat already exists", HttpStatus.CONFLICT);
    }
    let newChat: Chat;

    chat.password = hashedPassword;
    newChat = this.chatRepository.create(chat);

    try {
      await this.chatRepository.save(newChat);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    delete newChat.password;
    return newChat;
  }

  async deleteChat(id: number): Promise<void> {
    const chat = await this.getChat(id, ["members", "messages"]);

    await this.messageRepository.remove(chat.messages);
    await this.chatRepository.remove(chat);
  }

  async removeUserFromChat(
    userId: number,
    chatId: number,
    adminId?: number
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const chat = await this.getChat(chatId, ["members"]);

    if (adminId && adminId != user.id) {
      if (chat.admin.indexOf(user) == -1)
        throw new HttpException(
          "User is NOT admin in this chat",
          HttpStatus.FORBIDDEN
        );

      if (user.id == chat.owner.id)
        throw new HttpException("Cannot kick an owner", HttpStatus.FORBIDDEN);

      const index = chat.admin.indexOf(user);
      if (index != -1) chat.admin.splice(index, 1);
    } else if (user.id == chat.owner.id) return await this.deleteChat(chat.id);

    {
      const index = chat.members.findIndex((aUser) => aUser.id == user.id);
      if (index == -1)
        throw new HttpException("User NOT in chat", HttpStatus.NOT_FOUND);
      chat.members.splice(index, 1);
    }

    try {
      await this.chatRepository.save(chat);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(
    pasword: Password,
    chatId: number,
    userId: number
  ): Promise<void> {
    const user = await this.userService.getUser(userId);
    const chat = await this.getChat(chatId);

    if (chat.public == true)
      throw new HttpException("Chat is public", HttpStatus.FORBIDDEN);
    if (chat.owner.id != user.id)
      throw new HttpException(
        "User is NOT the chat's owner",
        HttpStatus.FORBIDDEN
      );
    if (!pasword.new)
      throw new HttpException(
        "New password cannot be empty",
        HttpStatus.BAD_REQUEST
      );

    if (!(await this.checkPassword(chat.id, pasword.new)))
      throw new HttpException(
        "Wrong credentials provided",
        HttpStatus.FORBIDDEN
      );

    try {
      const password = await bcrypt.hash(pasword.new, 10);
      await this.chatRepository.update(chat.id, { password });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async checkPassword(id: number, password: string): Promise<boolean> {
    if (!password) return false;

    const chat = await this.getChat(id, [], true);
    if (!chat) return false;

    return await bcrypt.compare(password, chat.password);
  }

  async getAll(): Promise<Chat[]> {
    const chats = await this.chatRepository.find();
    chats.forEach((chat) => delete chat.password);
    return chats;
  }

  async getUserChats(userId: number): Promise<Chat[]> {
    const userChatsQuery: Chat[] = await this.chatRepository
      .createQueryBuilder("chat")
      .innerJoin("chat.users", "user")
      .where("user.id = :userId", { userId })
      .getMany();

    const chats: Promise<Chat>[] = userChatsQuery.map((chat) =>
      this.getChat(chat.id, ["members", "messages"])
    );
    return await Promise.all(chats);
  }

  async addUserToChat(chat: Chat, userId: number): Promise<void> {
    const user = await this.userService.getUser(userId);
    const thisChat = await this.getChat(chat.id, ["members"], true);
    if (!thisChat.public) {
      let valid = false;
      if (thisChat.password)
        valid = bcrypt.compareSync(chat.password, thisChat.password);
      if (!valid)
        throw new HttpException("Wrong password", HttpStatus.FORBIDDEN);
    }

    if (thisChat.members.find((aCase) => aCase.id == user.id))
      throw new HttpException("User already in chat", HttpStatus.CONFLICT);

    await this.chatRepository
      .createQueryBuilder()
      .relation(Chat, "members")
      .of(thisChat)
      .add(user);
  }
}
