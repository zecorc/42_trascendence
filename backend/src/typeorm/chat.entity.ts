import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { User } from "@/typeorm/user.entity";
import { Message } from "@/typeorm/message.entity";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @ManyToMany(() => Message)
  @JoinTable()
  messages: Message[];
}
