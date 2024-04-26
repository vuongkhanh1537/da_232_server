import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { AxiosService } from 'src/config/axios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/entities/device.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LogService } from 'src/log/log.service';
import { LogModule } from 'src/log/log.module';
import { ActivityLog } from 'src/entities/activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, ActivityLog]),
    AuthModule, 
    LogModule
  ],
  controllers: [DeviceController],
  providers: [DeviceService, AxiosService, LogService]
})
export class DeviceModule {}
