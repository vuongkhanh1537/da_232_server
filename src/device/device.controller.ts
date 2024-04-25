import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeviceThresholdSettingDto } from './dto/threshold-setting.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { LogService } from 'src/log/log.service';

@ApiTags('Devices')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard())
@Controller('device')
export class DeviceController {
    constructor(
        private readonly deviceService: DeviceService,
        private readonly logService: LogService,
    ) {}

    @Get('getAllDevices') 
    @HttpCode(200)
    getAllDevices() {
        return this.deviceService.getAllDevices();
    }

    @Get('getDeviceStatus')
    @HttpCode(200)
    async getDeviceStatus() {
        return await this.deviceService.getAllDeviceStatus();
    }

    @Get('getDeviceInfo/:id')
    @HttpCode(200)
    getDeviceInfo(@Param('id') id: number) {
        return this.deviceService.getDeviceInfo(id);
    }

    @Get('toggleDevice/:id')
    @HttpCode(200)
    async toggleDevice(
        @Param('id') id: number,
        @GetUser() user: User,
    ) {
        const repsonse = await this.deviceService.toggleDevice(id);
        this.logService.createLog(id, user.id, repsonse);
        return repsonse;
    }

    @Get('toggleAutoModeDevice/:id')
    @HttpCode(200)
    async toggleAutoModeDevice(
        @Param('id') id:number,
        @GetUser() user: User,
    ) {
        const repsonse = await this.deviceService.toggleAutoModeDevice(id);
        this.logService.createLog(id, user.id, repsonse);
        return repsonse;
    }

    @Get('getThreshold/:id')
    @HttpCode(200)
    getThreshold(
        @Param('id') id: number
    ) {
        return this.deviceService.getThreshold(id);
    }

    @Post('setThreshold/:id')
    @HttpCode(200)
    setThreshold(
        @Param('id') id: number,
        @Body() deviceThresholdSettingDto: DeviceThresholdSettingDto,
    ){
        return this.deviceService.setThreshold(id, deviceThresholdSettingDto);
    }

    @Get('asyncDevices')
    @HttpCode(200)
    @ApiOperation({ description: 'Use this api when you need to refresh device info, especially when something seem goes wrong'})
    asyncDevices() {
        return this.deviceService.asyncDevices();
    }
}
