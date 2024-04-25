import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ActivityLog } from "./activity-log.entity";
import { Record } from "./record.entity";

@Entity()
export class Device extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column()
    autoMode: boolean;

    @Column()
    thresholdValue: number;

    @Column()
    thresholdType: string;

    @OneToMany(type => ActivityLog, log => log.device, {eager: false})
    logs: ActivityLog[];

    @OneToMany(type => Record, record => record.device, {eager: false})
    records: Record[];
}