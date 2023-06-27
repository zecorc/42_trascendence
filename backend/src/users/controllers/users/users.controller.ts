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
  UseGuards,
} from "@nestjs/common";
import { UserService } from "@/users/services/users/user.service";
import { Match, User } from "@/typeorm";
import { Readable } from "stream";
import { CreateUserDto } from "@/users/dtos/CreateUser.dto";
import { PictureService } from "@/users/services/pictures/pictures.service";
import { AuthGuard42 } from './../../../auth/auth.guard';
import {ApiSecurity} from '@nestjs/swagger'
import { Public } from '../../../auth/public.decorator';



@Controller("user")
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly pictureService: PictureService
  ) {}

  @Public()
  @Get("/all")
  @ApiSecurity('Api-Key')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get("/:id")
  @ApiSecurity('Api-Key')
  getUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  //TODO use @Res ?
  @Get("/:id/picture")
  @UseGuards(AuthGuard42)
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

  @Get("/:id/email")
  getEmail(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.userService.getEmail(id);
  }

  @Get("/:id/userName")
  getUserName(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.userService.getUserName(id);
  }

  @Post("userName")
  setUserName(@Param("id", ParseIntPipe) id: number, @Param("userName", ParseIntPipe) userName: string)
  {
    this.userService.setUserName(id, userName);
  }

  @Public()
  @Get("/:id/token")
  getToken(@Param("id", ParseIntPipe) id: number): Promise<any> {
    return this.userService.getToken(id);
  }
}
