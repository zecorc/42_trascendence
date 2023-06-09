import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserStatus } from "@/types/enums/status.enum";
import { Match } from "@/typeorm/match.entity";
import { Picture } from "@/typeorm/picture.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @ApiProperty()
  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @ApiProperty()
  @Column({
    unique: true,
    nullable: true,
  })
  oauthToken: string;

  @ApiProperty()
  @Column({
    name: "email_address",
    nullable: false,
  })
  email: string;

  @ApiProperty()
  @Column({
    nullable: false,
  })
  password: string;

  @ApiProperty()
  @Column({ default: UserStatus.OFFLINE })
  status: UserStatus;

  @ApiProperty()
  @Column()
  rank: number;

  @ApiProperty()
  @OneToMany(() => Match, (match) => match.winner)
  won: Match[];

  @ApiProperty()
  @OneToMany(() => Match, (match) => match.loser)
  lost: Match[];

  @ApiProperty()
  @OneToOne(() => Picture, (picture) => picture.user)
  picture: Picture;
}
