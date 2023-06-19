import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post, Res, StreamableFile,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "src/users/services/users/users.service";
import {Match, User} from "@/typeorm";
import { Readable } from 'stream';
import {CreateUserDto} from "@/users/dtos/CreateUser.dto";
import {PictureService} from "@/users/services/pictures/pictures.service";


@Controller("users")
export class UsersController {
  constructor(
      private readonly userService: UsersService,
      private readonly pictureService: PictureService

  ) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get("/:id")
  findUsersById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  //TODO use @Res ?
  @Get('/:id/picture')
  async getPicture(
      @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const picture = await this.userService.getPicture(id);
    return new StreamableFile(Readable.from(picture.data));
  }

  @Get('/:id/matches')
  getMatches(@Param('id', ParseIntPipe) userid: number): Promise<Match[]> {
    return this.userService.getMatches(userid);
  }
  @Post("create")
  @UsePipes(ValidationPipe)
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
