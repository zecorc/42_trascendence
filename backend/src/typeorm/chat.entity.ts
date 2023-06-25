import {
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "@/typeorm/user.entity";
import { Message } from "@/typeorm/message.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Chat {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true, length: 8 })
  name: string;

  @ApiProperty()
  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @ApiProperty({ type: () => Message })
  @ManyToMany(() => Message)
  @JoinTable()
  messages: Message[];

  @ApiProperty()
  @Column({ default: true })
  public: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  password: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  @JoinColumn()
  owner: User;

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, { onDelete: "CASCADE", eager: true })
  @JoinTable()
  admin: User[];
}
