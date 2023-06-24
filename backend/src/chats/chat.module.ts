import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {Chat, Message, User} from "@/typeorm";
import {ChatController} from "@/chats/controllers/chat.controller";
import {ChatService} from "@/chats/services/chat.service";
import {UsersModule} from "@/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message, User]), UsersModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],

})
export class ChatModule {}
