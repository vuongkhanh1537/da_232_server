import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from 'src/entities/activity-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(ActivityLog) 
        private logRepository: Repository<ActivityLog>
    ) {}

    async createLog(deviceId: number, userId: number, data) {
        const action = await this.handleResponse(data);
        const log = new ActivityLog();
        log.userId = userId;
        log.createdAt = new Date();
        log.action = action;
        log.deviceId = deviceId;
        await log.save();
    }

    async getAllLog(): Promise<ActivityLog[]> {
        const logs = await this.logRepository.find({relations: ['user']});
        
        return (await this.removePassword(logs)).reverse();
    }

    async findLogsByUserId(id: number) {
        const logs = await this.logRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user')
            .where('user.id = :userId', { userId: id })
            .orderBy('log.id', 'DESC')
            .getMany();
        return this.removePassword(logs);
    }

    async findLogsInTimeRange(startDate: Date, endDate: Date) {
        endDate.setDate(endDate.getDate() + 1);
        const logs = await this.logRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user')
            .where('log.createdAt >= :startDate', { startDate })
            .andWhere('log.createdAt <= :endDate', { endDate })
            .orderBy('log.id', 'DESC')
            .getMany()
        return this.removePassword(logs);
    }

    private async removePassword(logs: ActivityLog[]) {
        return logs.map(log => {
            delete log.user.password;
            return log;
        })
    }

    private async handleResponse(data): Promise<string> {
        const { value, device, message } = data;
        const status = value == 0? 'off' : 'on';
        let setting: string;
        if (message.includes('auto')) {
            setting = `${device.name} auto mode`;
        } else {
            setting = `${device.name} device`;
        }
        return `Turn ${status} ${setting}`;
    }
}
