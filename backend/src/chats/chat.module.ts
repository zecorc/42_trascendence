import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chat, Message } from "@/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message])],
  providers: [],
  controllers: [],
})
export class ChatModule {}
