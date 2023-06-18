import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
