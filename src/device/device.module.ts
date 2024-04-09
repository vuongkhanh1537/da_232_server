import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { AxiosService } from 'src/config/axios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device])
  ],
  controllers: [DeviceController],
  providers: [DeviceService, AxiosService]
})
export class DeviceModule {}
