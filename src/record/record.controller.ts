import { Body, Controller, Get, Param } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('record')
export class RecordController {
    constructor(private readonly recordService: RecordService) { }

    @Get('getAllSensors')
    async getAllSensors() {
        return this.recordService.getAllSensors();
    }

    @Get('getSensorData/:sensor_key')
    async getSensorData(
        @Param('sensor_key') feedKey: string,
    ) {
        return this.recordService.getSensorData(feedKey);
    }

    @Get('getLastSensorData')
    async getLastSensorData() {
        return this.recordService.getLastDataOfAllFeeds();
    }
}
