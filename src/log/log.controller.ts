import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogService } from './log.service';

@ApiTags('Activity Log')
@Controller('log')
export class LogController {
    constructor (
        private logService: LogService,
    ) {}

    @Get('getAllLog')
    getAllLog() {
        return this.logService.getAllLog();
    }

    @Get('search/date')
    findLogsInTimeRange(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            throw new Error('Invalid date format');
        }

        return this.logService.findLogsInTimeRange(startDateObj, endDateObj);
    }

    @Get('search/:username')
<<<<<<< HEAD
    findLogsByUserId(
        @Param('userId') userId: number,
=======
    findLogsByUsername(
        @Param('username') username: string,
>>>>>>> fc7a84c31695c37368558fadf6fce54f17d9d4b4
    ) {
        return this.logService.findLogsByUsername(username);
    }
}
