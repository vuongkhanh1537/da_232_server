import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/entities/record.entity';
import { AxiosService } from 'src/config/axios.service';
import { DeviceService } from 'src/device/device.service';
import { Device } from 'src/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record, Device]),
  ],
  controllers: [RecordController],
  providers: [RecordService, AxiosService, DeviceService]
})
export class RecordModule {}
