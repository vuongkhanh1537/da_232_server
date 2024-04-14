import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { AxiosService } from 'src/config/axios.service';
import { Record } from 'src/entities/record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
    private readonly logger = new Logger(RecordService.name);
    private list_sensors: string[];
    constructor(
        private axiosService: AxiosService,
        @InjectRepository(Record)
        private recordRepository: Repository<Record>,
    ) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    private async saveLastDataToDB() {
        const data = await this.getLastDataOfAllFeeds();
        data.map(async item =>{
            const isExist = await this.recordRepository.findOne({ where: {
                    key: item.key,
                    value: item.value,
                    createdAt: item.createdAt,
                }})

            if (!isExist) {
                const record = new Record();
                record.key = item.key;
                record.value = item.value;
                record.createdAt = item.createdAt;
                try {
                    record.save();
                } catch(err) {
                    console.log(err);
                }
            }
        })
    }

    async getAllSensors(): Promise<any> {
        const data = await this.axiosService.axiosRequest('GET', 'feeds');
        return data.map(item => {
            if (item.key.includes('sensor'))
                return {
                    id: item.id,
                    name: item.name,
                    key: item.key,
                }
        }).filter(Boolean);
    }

    async getLastDataOfAllFeeds(): Promise<any> {
        if (!this.list_sensors) {
            this.list_sensors = await this.getAllSensorsKey();
        }
        const result = this.list_sensors.map(async key => {
            const data = await this.axiosService.axiosRequest('GET', `feeds/${key}/data/last`);
            console.log(key, data.value, data.created_at);
            return {key, value: data.value, createdAt: data.created_at}
        })
        console.log('-')
        return Promise.all(result);
    } 
    
    async getSensorData(sensor_key: string) {
        const data = await this.axiosService.axiosRequest('GET', `feeds/${sensor_key}/data`);
        const result = await data.map( item => {
            return {
                value: item.value,
                key: item.feed_key,
                createdAt: item.created_at,
            }
        });
        
        return result;
    }
    
    private async getAllSensorsKey(): Promise<string[]> {
        const feeds = await this.getAllSensors();
        return feeds.map(item => {
            return item.key;
        });
    }

    async getAllFeeds() {
        const data = await this.axiosService.axiosRequest('GET', 'feeds');
        return data.map(item => {
            return {
                id: item.id,
                name: item.name,
                key: item.key,
            }
        });
    }
}
