import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  StreamableFile,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "@/users/services/users/user.service";
import { Match, User } from "@/typeorm";
import { Readable } from "stream";
import { CreateUserDto } from "@/users/dtos/CreateUser.dto";
import { PictureService } from "@/users/services/pictures/pictures.service";

@Controller("user")
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly pictureService: PictureService
  ) {}

  @Get("/all")
  getUsers() {
    return this.userService.getUsers();
  }

  @Get("/:id")
  getUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  //TODO use @Res ?
  @Get("/:id/picture")
  async getPicture(
    @Param("id", ParseIntPipe) id: number
  ): Promise<StreamableFile> {
    const picture = await this.userService.getPicture(id);
    return new StreamableFile(Readable.from(picture.data));
  }

  @Get("/:id/matches")
  getMatches(@Param("id", ParseIntPipe) userid: number): Promise<Match[]> {
    return this.userService.getMatches(userid);
  }
  @Post("create")
  @UsePipes(ValidationPipe)
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
