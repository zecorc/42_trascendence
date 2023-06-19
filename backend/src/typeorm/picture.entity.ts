import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Picture {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ type: 'bytea' })
    data: Buffer;

    @ApiProperty()
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;
}