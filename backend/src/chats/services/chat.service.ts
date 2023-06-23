import {
    Injectable,
    HttpException,
    HttpStatus,
    forwardRef,
    Inject,
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Chat, Message, User} from "@/typeorm";
import {Repository} from "typeorm";
import {UserService} from "@/users/services/users/user.service";
import * as bcrypt from 'bcrypt';



const temporary = 30 * 60 * 1000;

@Injectable()
export class ChatService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,

        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        // @InjectRepository(Message)
        // private readonly messageRepository: Repository<Message>,
    ) {}

    async getChat(
        chatId: number,
        relations = [] as string[],
        needPass?: boolean,
    ): Promise<Chat> {
        let chat = null;
        if (chatId)
            chat = await this.chatRepository.findOne({
                where: {
                    id: chatId,
                },
                relations: relations,
            });

        if (!chat)
            throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

        if (!needPass) delete chat.password;
        return chat;
    }

    async createChat(
        chat: Chat,
        userId: number,
    ): Promise<Chat> {
        const admin = await this.userService.getUser(userId);

        chat.name = chat.name.replace(/\s+/g, '');

        if (chat.name == undefined)
            throw new HttpException(
                'Chat name needs to be specified',
                HttpStatus.FORBIDDEN,
            );

        let hashedPassword = null;
        if (chat.public == false) {
            {
                if (!chat.password)
                    throw new HttpException('Password Required', HttpStatus.FORBIDDEN);

                if (chat.password.length > 16)
                    throw new HttpException(
                        'New password too long',
                        HttpStatus.FORBIDDEN,
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
        )
            throw new HttpException(
                'Chat already exists',
                HttpStatus.FORBIDDEN,
            );
        let currentChat: Chat;

        chat.password = hashedPassword;
        currentChat = this.chatRepository.create(chat);

        try {
            await this.chatRepository.save(currentChat);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        delete currentChat.password;
        return currentChat;
    }
    //
    // async deleteChat(id: number): Promise<void> {
    //     const chat = await this.getChat(id, [
    //         'users',
    //         'muted',
    //         'banned',
    //         'logs',
    //     ]);
    //
    //     await this.messageRepository.remove(chat.logs);
    //     await this.userRepository.remove(chat.muted);
    //     await this.chatRepository.remove(chat);
    // }
    //
    // async removeUserFromChat(
    //     userId: number,
    //     chatId: number,
    //     adminId?: number,
    // ): Promise<void> {
    //     const user = await this.userService.getUser(userId);
    //     const chat = await this.getChat(chatId, ['users']);
    //
    //     if (adminId && adminId != user.id) {
    //         if (chat.adminId.indexOf(adminId) == -1)
    //             throw new HttpException(
    //                 'User isnt admin in chat',
    //                 HttpStatus.FORBIDDEN,
    //             );
    //
    //         if (user.id == chat.owner.id)
    //             throw new HttpException('Cannot kick an owner', HttpStatus.FORBIDDEN);
    //
    //         const index = chat.adminId.indexOf(user.id);
    //         if (index != -1) chat.adminId.splice(index, 1);
    //     } else if (user.id == chat.owner.id)
    //         return await this.deleteChat(chat.id);
    //
    //     {
    //         const index = chat.users.findIndex((user1) => user1.id == user.id);
    //         if (index == -1)
    //             throw new HttpException('User not in chat', HttpStatus.NOT_FOUND);
    //         chat.users.splice(index, 1);
    //     }
    //
    //     try {
    //         await this.chatRepository.save(chat);
    //     } catch (error) {
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }
    //
    async changePassword(
        pass: {
            old: string;
            new: string;
        },
        chatId: number,
        userId: number,
    ): Promise<void> {
        if (pass.new.length > 16)
            throw new HttpException('New password too long', HttpStatus.FORBIDDEN);
        const user = await this.userService.getUser(userId);
        const chat = await this.getChat(chatId);

        if (chat.public == true)
            throw new HttpException('Chat is public', HttpStatus.FORBIDDEN);
        if (chat.owner.id != user.id)
            throw new HttpException(
                "User isn't the chat's owner",
                HttpStatus.FORBIDDEN,
            );
        if (!pass.new)
            throw new HttpException(
                'New password cannot be empty',
                HttpStatus.FORBIDDEN,
            );

        if (!(await this.checkPassword(chat.id, pass.new)))
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.FORBIDDEN,
            );

        try {
            const password = await bcrypt.hash(pass.new, 10);
            await this.chatRepository.update(chat.id, { password });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async checkPassword(id: number, password: string): Promise<boolean> {
        if (!password) return false;

        const currentChat = await this.getChat(id, [], true);
        if (!currentChat) return false;

        return await bcrypt.compare(password, currentChat.password);
    }

    async getAll(): Promise<Chat[]> {
        const chats = await this.chatRepository.find();
        chats.forEach((chat) => delete chat.password);
        return chats;
    }
    //
    // async getChatsForUser(userId: number): Promise<Chat[]> {
    //     const uncompleted: Chat[] = await this.chatRepository
    //         .createQueryBuilder('chat')
    //         .innerJoin('chat.users', 'user')
    //         .where('user.id = :userId', { userId })
    //         .getMany();
    //
    //     const unresolved: Promise<Chat>[] = uncompleted.map((chat) =>
    //         this.getChat(chat.id, ['users', 'muted', 'banned', 'logs']),
    //     );
    //     return await Promise.all(unresolved);
    // }
    //
    // async addUserToChat(chat: Chat, userId: number): Promise<void> {
    //     const user = await this.userService.getUser(userId);
    //     const curchat = await this.getChat(
    //         chat.id,
    //         ['users', 'banned'],
    //         true,
    //     );
    //     if (!curchat.public) {
    //         let valide = false;
    //         if (curchat.password)
    //             valide = bcrypt.compareSync(chat.password, curchat.password);
    //         if (!valide)
    //             throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    //     }
    //
    //     for (const banned of curchat.banned)
    //         if (banned.user.id == user.id) {
    //             const time = new Date();
    //             if (banned.endOfBan > time)
    //                 throw new HttpException(
    //                     'User is banned from Chat',
    //                     HttpStatus.FORBIDDEN,
    //                 );
    //             await this.unBanUserInChat(banned, curchat);
    //         }
    //
    //     if (curchat.users.find((user1) => user1.id == user.id))
    //         throw new HttpException('User already in chat', HttpStatus.CONFLICT);
    //
    //     await this.chatRepository
    //         .createQueryBuilder()
    //         .relation(Chat, 'users')
    //         .of(curchat)
    //         .add(user);
    // }
    //
    // async toggleAdminRole(
    //     ownerId: number,
    //     userId: number,
    //     chatid: number,
    // ): Promise<void> {
    //     const owner = await this.userService.getUser(ownerId);
    //     const user = await this.userService.getUser(userId);
    //     const chat = await this.getChat(chatid, ['users']);
    //     if (chat.owner.id != owner.id)
    //         throw new HttpException(
    //             "User isn't the chat's owner",
    //             HttpStatus.FORBIDDEN,
    //         );
    //
    //     if (user.id == chat.owner.id)
    //         throw new HttpException('Owner cannot be demoted', HttpStatus.FORBIDDEN);
    //
    //     if (!chat.users.find((user1) => user1.id == user.id))
    //         throw new HttpException(
    //             "User getting promoted isn't part of the chat",
    //             HttpStatus.FORBIDDEN,
    //         );
    //
    //     {
    //         const index = chat.adminId.indexOf(user.id);
    //         if (index == -1) chat.adminId.push(user.id);
    //         else chat.adminId.splice(index, 1);
    //     }
    //
    //     try {
    //         await this.chatRepository.save(chat);
    //     } catch (error) {
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }
    //
    // async unBanUserInChat(
    //     user: BannedUser,
    //     chat: Chat,
    // ): Promise<void> {
    //     const index = chat.banned.findIndex((user1) => user1.id == user.id);
    //     if (index == -1) return;
    //
    //     await this.bannedUserRepository.delete(user.id);
    // }
    //
    // async unMuteUserInChat(
    //     user: MutedUser,
    //     chat: Chat,
    // ): Promise<void> {
    //     const index = chat.muted.findIndex((user1) => user1.id == user.id);
    //     if (index == -1) return;
    //
    //     await this.mutedUserRepository.delete(user.id);
    // }
    //
    // async muteUserInChat(
    //     userId: number,
    //     chatid: number,
    //     adminId: number,
    // ): Promise<void> {
    //     const user = await this.userService.getUser(userId);
    //     const admin = await this.userService.getUser(adminId);
    //     const currentChat = await this.getChat(chatid, ['users', 'muted']);
    //     if (currentChat.owner.id == user.id)
    //         throw new HttpException(
    //             'User is owner and thus cannot be muted',
    //             HttpStatus.FORBIDDEN,
    //         );
    //
    //     if (!currentChat.users.find((user1) => user1.id == user.id))
    //         throw new HttpException('User isnt in chat', HttpStatus.NOT_FOUND);
    //
    //     if (!currentChat.adminId.find((adminId) => adminId == admin.id))
    //         throw new HttpException(
    //             'User isnt admin in chat',
    //             HttpStatus.FORBIDDEN,
    //         );
    //
    //     if (currentChat.muted.find((user1) => user1.user.id == user.id))
    //         throw new HttpException('User is already muted', HttpStatus.FORBIDDEN);
    //
    //     const time = new Date(Date.now() + temporary);
    //     const muted = this.mutedUserRepository.create({
    //         user,
    //         endOfMute: time,
    //         chat: currentChat,
    //     });
    //
    //     try {
    //         await this.mutedUserRepository.save(muted);
    //     } catch (error) {
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }
    //
    // async banUserInChat(
    //     userId: number,
    //     chatid: number,
    //     adminId: number,
    // ): Promise<void> {
    //     const admin = await this.userService.getUser(adminId);
    //     const user = await this.userService.getUser(userId);
    //     const currentChat = await this.getChat(chatid, [
    //         'users',
    //         'banned',
    //     ]);
    //     if (currentChat.owner.id == user.id)
    //         throw new HttpException(
    //             'User is owner and thus cannot be banned',
    //             HttpStatus.FORBIDDEN,
    //         );
    //
    //     if (!currentChat.users.find((user1) => user1.id == user.id))
    //         throw new HttpException('User isnt in chat', HttpStatus.NOT_FOUND);
    //
    //     if (!currentChat.adminId.find((adminId) => adminId == admin.id))
    //         throw new HttpException(
    //             'User isnt admin in chat',
    //             HttpStatus.FORBIDDEN,
    //         );
    //
    //     if (currentChat.banned.find((user1) => user1.user.id == user.id))
    //         throw new HttpException('User is already banned', HttpStatus.FORBIDDEN);
    //
    //     const time = new Date(Date.now() + temporary);
    //     const banned = this.bannedUserRepository.create({
    //         user,
    //         endOfBan: time,
    //         chat: currentChat,
    //     });
    //
    //     currentChat.users.splice(
    //         currentChat.users.findIndex((user1) => user1.id == user.id),
    //         1,
    //     );
    //
    //     try {
    //         await this.chatRepository.save(currentChat);
    //         await this.bannedUserRepository.save(banned);
    //     } catch (error) {
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }
    //
    // async addLogForChat(
    //     id: number,
    //     message: string,
    //     userId: number,
    // ): Promise<void> {
    //     const user = await this.userService.getUser(userId);
    //     const currentChat = await this.getChat(id, [
    //         'users',
    //         'logs',
    //         'muted',
    //     ]);
    //     if (!currentChat.users.find((user1) => user1.id == user.id))
    //         throw new HttpException('User isnt in chat', HttpStatus.NOT_FOUND);
    //
    //     {
    //         const muted = currentChat.muted.find(
    //             (user1) => user1.user.id == user.id,
    //         );
    //         if (muted) {
    //             const time = new Date();
    //             if (muted.endOfMute > time)
    //                 throw new HttpException(
    //                     'User is muted from Chat',
    //                     HttpStatus.FORBIDDEN,
    //                 );
    //             await this.unMuteUserInChat(muted, currentChat);
    //         }
    //     }
    //
    //     const log = this.messageRepository.create({
    //         message: message,
    //         user: user,
    //     });
    //
    //     try {
    //         await this.messageRepository.save(log);
    //         await this.chatRepository
    //             .createQueryBuilder()
    //             .relation(Chat, 'logs')
    //             .of(currentChat)
    //             .add(log);
    //     } catch (error) {
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }
}
