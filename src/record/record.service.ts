import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Record } from 'src/entities/record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
    private readonly logger = new Logger(RecordService.name);
    private readonly username: string;
    private readonly baseUrl: string;
    private readonly apiUrl: string;
    private list_sensors: string[];
    constructor(
        @InjectRepository(Record)
        private recordRepository: Repository<Record>,
    ) {
        this.username = process.env.ADAFRUIT_IO_USERNAME
        this.baseUrl = 'https://io.adafruit.com';
        this.apiUrl = `${this.baseUrl}/api/v2/${this.username}`;

        axios.interceptors.request.use((config) => {
            config.headers['X-AIO-Key'] = process.env.ADAFRUIT_IO_KEY;
            return config;
        });
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        await this.getLastDataOfAllFeeds();
    }

    private async axiosRequest(method: string, path: string, data?: any): Promise<any> {
        try {
            const url = `${this.apiUrl}/${path}`;
            const response = await axios({ method, url, data });
            return response.data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getAllSensors(): Promise<any> {
        const data = await this.axiosRequest('GET', 'feeds');
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
        this.list_sensors.map(async key => {
            const data = await this.axiosRequest('GET', `feeds/${key}/data/last`);
            const isExist = await this.recordRepository.findOne({ where: {
                key: key,
                value: data.value,
                createAt: data.created_at,
            }})
            if (!isExist) {
                const record = new Record();
                record.key = key;
                record.value = data.value;
                record.createAt = data.created_at;
                record.save();
            }
        })
    }

    async getAllSensorsKey(): Promise<string[]> {
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

    async getSensorData(sensor_key: string) {
        if (true) {
            const data = await this.axiosRequest('GET', `feeds/${sensor_key}/data`);
            const result = await data.map( item => {
                return {
                    value: item.value,
                    key: item.feed_key,
                    createdAt: item.created_at,
                }
            });
            const dbData = await this.recordRepository.findOne({where: {key: sensor_key}});
            console.log(dbData);
            if (!dbData) {  
                this.saveFeedDataToDb(result);
            }
            return result;
        } else {
            const data = await this.recordRepository.find({ where: { key: sensor_key } })
            return data;
        }

    }
}
