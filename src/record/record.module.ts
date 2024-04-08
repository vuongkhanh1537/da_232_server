import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/entities/record.entity';
import { AxiosService } from 'src/config/axios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record]),
  ],
  controllers: [RecordController],
  providers: [RecordService, AxiosService]
})
export class RecordModule {}
