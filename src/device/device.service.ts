import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosService } from 'src/config/axios.service';
import { Device } from 'src/entities/device.entity';
import { Repository } from 'typeorm';
import { DeviceThresholdSettingDto } from './dto/threshold-setting.dto';

@Injectable()
export class DeviceService {
    private devices: string[];
    constructor(
        private readonly axiosService: AxiosService,
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>

    ) {
        this.devices = ['led', 'pump']
    }


    async getAllDeviceStatus() {
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

    async getAllDevices() {
        let data = await this.deviceRepository.find();
        console.log(data);
        if (data.length == 0) {
            await this.createDevice();
            return await this.deviceRepository.find();
        }
        return data;
    }

    async getDeviceInfo(id: number) {
        return await this.findDeviceInfoById(id);
    }

    async getThreshold(id: number) {
        const device = await this.findDeviceInfoById(id);
        return {
            value: device.thresholdValue,
        }
    }

    async setThreshold(
        id: number,
        deviceThresholdSettingDto: DeviceThresholdSettingDto,
    ) {
        const device = await this.findDeviceInfoById(id);
        const typeThreshold = device.thresholdType;
        const { thresholdValue } = deviceThresholdSettingDto;
        this.axiosService.axiosRequest('POST', `feeds/${typeThreshold}/data`, { value: thresholdValue });
        device.thresholdValue = thresholdValue;
        await device.save();
    }

    async toggleDevice(id: number) {
        const device = await this.findDeviceInfoById(id);
        if (device.autoMode) {
            throw new BadRequestException('Auto mode is on');
        }

        const data = await this.getDeviceStatusByName(device.name);
        if (data.value === '0') {
            this.axiosService.axiosRequest('POST', `feeds/${device.name}/data`, { value: 1 });
            return {
                value: 1,
                device,
                message: "Device is turning on now"
            } 
        } else {
            this.axiosService.axiosRequest('POST', `feeds/${device.name}/data`, { value: 0 });
            return {
                value: 0,
                device,
                message: "Device is turning off now"
            } 
        }
    }

    async toggleAutoModeDevice(id: number) {
        const device = await this.findDeviceInfoById(id);
        const autoMode = await this.axiosService.axiosRequest('GET', `feeds/${device.name}-mode/data/last`);
        
        device.autoMode = !parseInt(autoMode.value);
        await device.save();
        if (!device.autoMode) {
            this.axiosService.axiosRequest('POST', `feeds/${device.name}-mode/data`, { value: 0 })
            return {
                value: 0,
                device,
                message: "Turned off auto mode"
            } 
        } else {
            this.axiosService.axiosRequest('POST', `feeds/${device.name}-mode/data`, { value: 1 })
            return {
                value: 1,
                device,
                message: "Turned on auto mode"
            } 
        }
    }

    async asyncDevices() {
        this.devices.map(async deviceName => {
            const device = await this.deviceRepository.findOne({ where:{ name: deviceName } });
            const autoMode = (await this.axiosService.axiosRequest('GET', `feeds/${deviceName}-mode/data/last`)).value;
            const thresholdValue = (await this.axiosService.axiosRequest('GET', `feeds/${device.thresholdType}/data/last`)).value;
            device.autoMode = autoMode === '0'? false : true;
            device.thresholdValue = thresholdValue;
            await device.save();
        })
    }

    private async findDeviceInfoById(id: number) {
        const data = await this.deviceRepository.findOne({ where:{ id } });
        if (!data) {
            throw new NotFoundException('Device Not Found');
        } 
        return data;
    }

    private async createDevice() {
        this.devices.map(async deviceName => {
            const device = new Device();
            device.name = deviceName;
            device.autoMode = false;
            device.thresholdValue = 0;
            device.thresholdType = deviceName === 'led'? 'threshold-light' : 'threshold-temp'; 
            await device.save();
        })
    }
}
