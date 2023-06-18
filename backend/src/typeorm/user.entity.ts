import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Status } from "@/enums/status.enum";
import { Match } from "@/typeorm/match.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: "bigint",
  })
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    name: "email_address",
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @OneToMany(() => Match, (match) => match.winner)
  won: Match[];

  @OneToMany(() => Match, (match) => match.loser)
  lost: Match[];

  @Column({ default: Status.OFFLINE })
  status: Status;
}
