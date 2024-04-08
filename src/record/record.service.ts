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

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        // await this.getLastDataOfAllFeeds();
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
            return {key, value: data.value, createAt: data.created_at}

            // const isExist = await this.recordRepository.findOne({ where: {
            //     key: key,
            //     value: data.value,
            //     createAt: data.created_at,
            // }})

            // if (!isExist) {
            //     const record = new Record();
            //     record.key = key;
            //     record.value = data.value;
            //     record.createAt = data.created_at;
            //     record.save();
            // }
        })
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

    private async saveFeedDataToDb(data) {
        data.map(async item => {
            const record = new Record();
            record.key = item.key;
            record.value = item.value;
            record.createAt = item.createAt;
            await record.save();
        })
    }
}
