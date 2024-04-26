import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Device } from "./device.entity";

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

    @ManyToOne(type => Device, device => device.logs, {eager: true})
    device: Device;

    @Column({nullable: false})
    deviceId: number;

    @Column({nullable: false})
    value: number;
}