import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "@/typeorm/user.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Message {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  user: User;
}
