import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from 'src/entities/activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityLog]),
  ],
  controllers: [LogController],
  providers: [LogService]
})
export class LogModule {}
