import { Body, Controller, Get, HttpCode, Param } from '@nestjs/common';
import { RecordService } from './record.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Records')
@Controller('record')
export class RecordController {
    constructor(private readonly recordService: RecordService) { }

    @Get('getAllSensors')
    @HttpCode(200)
    async getAllSensors() {
        return this.recordService.getAllSensors();
    }

    @Get('getSensorData/:sensor_key')
    @HttpCode(200)
    async getSensorData(
        @Param('sensor_key') feedKey: string,
    ) {
        return this.recordService.getSensorData(feedKey);
    }

    @Get('getLastSensorData')
    @HttpCode(200)
    async getLastSensorData() {
        return this.recordService.getLastDataOfAllFeeds();
    }

    @Get('getAllFeeds')
    @HttpCode(200)
    async getAllFeeds() {
        return this.recordService.getAllFeeds();
    }
}
