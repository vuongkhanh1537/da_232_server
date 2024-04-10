import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosService } from 'src/config/axios.service';
import { Device } from 'src/entities/device.entity';
import { Repository } from 'typeorm';
import { DeviceThresholdSettingDto } from './dto/threshold-setting.dto';

@Injectable()
export class DeviceService {
    private devices: string[]
    constructor(
        private readonly axiosService: AxiosService,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>

    ) {
        this.devices = ['led', 'pump']
    }

    async getDeviceStatus() {
        const data = this.devices.map(async device => {
            const data = await this.axiosService.axiosRequest('GET', `feeds/${device}/data/last`)
            return {
                device,
                value: data.value,
                createAt: data.created_at,
            }
        })
        return Promise.all(data);
    }

    async getDeviceStatusByName(deviceName: string) {
        const data = await this.axiosService.axiosRequest('GET', `feeds/${deviceName}/data/last`)
        return {
            name: deviceName,
            value: data.value,
            createAt: data.created_at,
        }
    }

    async getDeviceInfo(deviceName: string) {
        if (!this.devices.includes(deviceName)){ 
            throw new NotFoundException('Device not found');
        }
        const data = await this.deviceRepository.findOne({where: {name: deviceName}});
        if (!data) {
            return this.createDevice(deviceName);
        } else {
            return data;
        }
    }

    async setThreshold(
        id: number,
        deviceThresholdSettingDto: DeviceThresholdSettingDto,
    ) {
        const device = await this.findDeviceInfoById(id);
        const { maxThreshold, minThreshold } = deviceThresholdSettingDto;

        if (maxThreshold < minThreshold) {
            throw new BadRequestException('Max threshold must greater than min threshold')
        }

        if (maxThreshold) {
            device.maxThreshold = maxThreshold;
        }

        if (minThreshold) {
            device.minThreshold = minThreshold;
        }

        await device.save();
    }

    async toggleDevice(id: number) {
        const device = await this.findDeviceInfoById(id);
        if (device.autoMode) {
            throw new BadRequestException('Auto mode is on');
        }

        const data = await this.getDeviceStatusByName(device.name);
        console.log(data.value);
        if (data.value === '0') {
            // this.axiosService.axiosRequest('POST', `feeds/${device.name}/data`, JSON.stringify({ value: 1 }));
            return {
                message: "Device is turning on now"
            } 
        } else {
            // this.axiosService.axiosRequest('POST', `feeds/${device.name}/data`, JSON.stringify({ value: 0 }));
            return {
                message: "Device is turning off now"
            } 
        }
    }

    async toggleAutoModeDevice(id: number) {
        const device = await this.findDeviceInfoById(id);

        device.autoMode = !device.autoMode;
        device.save()
        
        if (!device.autoMode) {
            
            return {
                message: "Turned off auto mode"
            } 
        } else {
            // send value
            // this.axiosService.axiosRequest('POST', '');
            return {
                message: "Turned on auto mode"
            } 
        }
    }

    private async findDeviceInfoById(id: number) {
        const data = await this.deviceRepository.findOne({where:{id}});
        if (!data) {
            throw new NotFoundException('Device Not Found');
        } 
        return data;
    }

    private async createDevice(deviceName: string) {
        const device = new Device();
        device.name = deviceName;
        device.autoMode = false;
        device.maxThreshold = 0;
        device.minThreshold = 0;
        await device.save();
        return device;
    }
}
