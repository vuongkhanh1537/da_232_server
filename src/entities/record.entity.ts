import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Device } from "./device.entity";

@Entity()
export class Record extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column()
    value: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(type => Device, device => device.records, {eager: false})
    device: Device;

    @Column({nullable: true})
    deviceId: number;
} 