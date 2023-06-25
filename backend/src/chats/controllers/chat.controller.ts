import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Chat, User } from "@/typeorm";
import { ChatService } from "@/chats/services/chat.service";
import { Password } from "@/chats/dtos/Password.dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/all")
  getAllChats(): Promise<Chat[]> {
    return this.chatService.getAll();
  }

  @Post("/")
  @UsePipes(ValidationPipe)
  createChat(@Req() userReq: User, @Body() chat: Chat): Promise<Chat> {
    return this.chatService.createChat(chat, userReq.id);
  }

  @Post(":id/change/")
  @UsePipes(ValidationPipe)
  changePassword(
    @Req() userReq: User,
    @Param("id") chatId: number,
    @Body() password: Password
  ): Promise<void> {
    return this.chatService.changePassword(password, chatId, userReq.id);
  }
}
