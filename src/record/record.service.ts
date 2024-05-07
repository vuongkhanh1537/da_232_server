import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosService } from 'src/config/axios.service';
import { DeviceService } from 'src/device/device.service';
import { Device } from 'src/entities/device.entity';
import { Record } from 'src/entities/record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecordService {
    private list_sensors: string[];
    private list_devices: Promise<Device[]>;
    constructor(
        private axiosService: AxiosService,
        @InjectRepository(Record)
        private recordRepository: Repository<Record>,
        private deviceService: DeviceService
    ) {
        this.list_devices = deviceService.getAllDevices();
    }

    @Cron("*/15 * * * * *")
    private async saveLastDataToDB() {
        const data = await this.getLastDataOfAllFeeds();
        data.map(async item =>{
            const isExist = await this.recordRepository.findOne({ where: {
                    key: item.key,
                    value: item.value,
                    createdAt: new Date(item.createdAt),
                }})

            const deviceId = item.key === 'temp-sensor' ? 
                (await this.list_devices).find(device => device.name === 'pump').id :
                (await this.list_devices).find(device => device.name === 'led').id;

            if (!isExist) {
                const record = new Record();
                record.key = item.key;
                record.value = item.value;
                record.createdAt = new Date(item.createdAt);
                record.deviceId = deviceId;
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

    async getSensorDataByTime(sensor_key: string, start_date: string, end_date: string) {
        return await this.recordRepository
            .createQueryBuilder('record')
            .where('record.key = :sensor_key', { sensor_key })
            .andWhere('record.createdAt >= :start_date', { start_date })
            .andWhere('record.createdAt <= :end_date', { end_date })
            .orderBy('record.id', 'DESC')
            .getMany();
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

    async saveSensorDataIntoDB() {
        if (!this.list_sensors) {
            this.list_sensors = await this.getAllSensorsKey();
        }
        const promises = this.list_sensors.map(async sensor => {
            return await this.saveDataIntoDbByName(sensor);
        })

        Promise.all(promises)
            .then(result => {
                return "Successful";
            })
            .catch(err => {
                console.log(err);
            });
    }
    
    private async saveDataIntoDbByName(feed_key: string) {
        const start_time = '2024-01-01T00:00Z';
        const end_time = '2024-05-01T00:00Z';
        const data = await this.axiosService.axiosRequest('GET', `feeds/${feed_key}/data?start_time=${start_time}&end_time=${end_time}`);
        data.map(async item =>{
            const isExist = await this.recordRepository.findOne({ where: {
                    key: feed_key,
                    value: item.value,
                    createdAt: new Date(item.created_at),
                }})

            const deviceId = item.key === 'temp-sensor' ? 
                (await this.list_devices).find(device => device.name === 'pump').id :
                (await this.list_devices).find(device => device.name === 'led').id;

            if (!isExist) {
                const record = new Record();
                record.key = feed_key;
                record.value = item.value;
                record.createdAt = new Date(item.created_at);
                record.deviceId = deviceId;
                try {
                    record.save();
                } catch(err) {
                    console.log(err);
                }
            }
        })
    }
}
