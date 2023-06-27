import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "@/types/enums/status.enum";
import { Picture } from "@/typeorm";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  username: string;

  //@IsNotEmpty()
  //@MinLength(8)
  //@ApiProperty()
  //password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  rank: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  oauthToken: string;

  picture: Picture;
}
