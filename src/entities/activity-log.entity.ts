import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ActivityLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    action: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(type => User, user => user.logs, {eager: true})
    user: User;

    @Column({nullable: true})
    userId: number | null;
}