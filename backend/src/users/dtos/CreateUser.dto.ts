import {IsEmail, IsEnum, IsNotEmpty, MinLength, Validator, ValidatorConstraint} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from "@/typeorm/match.entity";
import { Status } from "@/enums/status.enum";
import {Picture} from "@/typeorm";

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

  @ApiProperty()
  rank: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

}
