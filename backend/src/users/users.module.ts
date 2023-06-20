import { Module } from "@nestjs/common";
import { UsersController } from "./controllers/users/users.controller";
import { UsersService } from "./services/users/users.service";
import { PictureService} from "./services/pictures/pictures.service";

import { TypeOrmModule } from "@nestjs/typeorm";
import {Friendship, Match, Picture, User} from "src/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([User, Match, Picture, Friendship])],
  controllers: [UsersController],
  providers: [UsersService, PictureService],
})
export class UsersModule {}
