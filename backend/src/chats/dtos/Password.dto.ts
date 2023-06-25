import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class Password {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(15)
  @ApiProperty()
  old: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(15)
  @ApiProperty()
  new: string;
}
