import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Match {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column("int", { array: true, default: [] })
  score: number[];

  @ApiProperty()
  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  winner: User;

  @ApiProperty()
  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  loser: User;
}
