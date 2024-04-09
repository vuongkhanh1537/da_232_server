import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class ActivityLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @CreateDateColumn()
    createAt: Date;
}