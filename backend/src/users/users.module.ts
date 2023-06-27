import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users/users.controller";
import { UserService } from "./services/users/user.service";
import { PictureService } from "./services/pictures/pictures.service";
import { AuthGuard42} from '../auth/auth.guard'; // Remove the import for AuthModule
import { AuthService } from '../auth/services/auth.service';

import { TypeOrmModule } from "@nestjs/typeorm";
import { Friendship, Match, Picture, User } from "src/typeorm";
import { ChatModule } from "@/chats/chat.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Match, Picture, Friendship])],
  controllers: [UsersController],
  providers: [UserService, PictureService, AuthService, AuthGuard42], // Include AuthService and JwtAuthGuard here
  exports: [UserService],
})
export class UsersModule {}
