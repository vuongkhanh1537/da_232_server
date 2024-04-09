import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { AxiosService } from 'src/config/axios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/entities/device.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    AuthModule
  ],
  controllers: [DeviceController],
  providers: [DeviceService, AxiosService]
})
export class DeviceModule {}
