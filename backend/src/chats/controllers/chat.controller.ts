import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from "@nestjs/common";
import { Chat, User } from "@/typeorm";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("/all")
  getAllChats(): Promise<Chat[]> {
    return this.chatService.getAll();
  }

  @Post("/")
  createChat(@Req() userReq: User, @Body() chat: Chat): Promise<Chat> {
    return this.chatService.createChat(chat, userReq.id);
  }

  @Post(":id/change/")
  changePassword(
    @Req() userReq: User,
    @Param("id") chatId: number,
    @Body()
    password: {
      old: string;
      new: string;
    }
  ): Promise<void> {
    return this.chatService.changePassword(password, chatId, userReq.id);
  }
}
