import { Body, Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { RecordService } from './record.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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

    @Get('search/date')
    getSensorDataByTimeRange(
        @Query('sensor_key') sensorKey: string,
        @Query('start_date') startDate: string, 
        @Query('end_date') endDate: string,
    ) {
        return this.getSensorDataByTimeRange(sensorKey, startDate, endDate);
    }

    @Get('getAllFeeds')
    @HttpCode(200)
    async getAllFeeds() {
        return this.recordService.getAllFeeds();
    }

    @Get('saveSensorDataIntoDB')
    @ApiOperation({ description: 'Only use this API when you need to fetch all data from ada into local DB, so no need you it on FE, just run it by cmd or on Swagger' })
    saveSensorDataIntoDB() {
        return this.recordService.saveSensorDataIntoDB(); 
    }
}
