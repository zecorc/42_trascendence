import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { FriendshipStatus } from "@/types/enums/status.enum";

@Entity()
export class Friendship {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  status: FriendshipStatus;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  me: User;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  other: User;
}
