import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat, Message } from "@/typeorm";
import {ChatController} from "@/chats/controllers/chat.controller";
import {ChatService} from "@/chats/services/chat.service";
import {AuthModule} from "@/auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]),
    AuthModule
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
