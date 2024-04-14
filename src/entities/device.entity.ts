import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}