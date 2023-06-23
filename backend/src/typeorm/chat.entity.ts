import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany, Column, ManyToOne, JoinColumn,
} from "typeorm";
import { User } from "@/typeorm/user.entity";
import { Message } from "@/typeorm/message.entity";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 8 })
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @ManyToMany(() => Message)
  @JoinTable()
  messages: Message[];

  @Column({ default: true })
  public: boolean;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn()
  owner: User;
}
