import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceThresholdSettingDto } from './dto/threshold-setting.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';

@ApiTags('Devices')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard())
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

    @Get('toggleDevice/:id')
    toggleDevice(
        @Param('id') id: number,
        @GetUser() user: User,
    ) {
        return this.deviceService.toggleDevice(id);
    }

    @Get('toggleAutoModeDevice/:id')
    
    toggleAutoModeDevice(
        @Param('id') id:number,
        @GetUser() user: User,
    ) {
        return this.deviceService.toggleAutoModeDevice(id);
    }

    @Post('setThreshold/:id')
    setThreshold(
        @Param('id') id: number,
        @Body() deviceThresholdSettingDto: DeviceThresholdSettingDto,
    ){
        return this.deviceService.setThreshold(id, deviceThresholdSettingDto);
    }
}
