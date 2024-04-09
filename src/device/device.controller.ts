import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeviceService } from './device.service';
import { ApiTags } from '@nestjs/swagger';
import { DeviceThresholdSettingDto } from './dto/threshold-setting.dto';

@ApiTags('Devices')
@Controller('device')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService
    ) {}

    @Get('getDeviceStatus')
    async getDeviceStatus() {
        return await this.deviceService.getDeviceStatus();
    }

    @Get('getDeviceInfo/:device_name')
    getDeviceInfo(@Param('device_name') deviceName: string) {
        return this.deviceService.getDeviceInfo(deviceName);
    }

    @Post('setThreshold/:id')
    setThreshold(
        @Param('id') id: number,
        @Body() deviceThresholdSettingDto: DeviceThresholdSettingDto,
    ){
        return this.deviceService.setThreshold(id, deviceThresholdSettingDto);
    }

    @Get('toggleDevice/:id')
    toggleDevice(
        @Param('id') id: number,
    ) {
        return this.deviceService.toggleDevice(id);
    }

    @Get('toggleAutoModeDevice/:id')
    toggleAutoModeDevice(
        @Param('id') id:number,
    ) {
        return this.deviceService.toggleAutoModeDevice(id);
    }
}