import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { RecordModule } from './record/record.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DeviceModule } from './device/device.module';
// import { CacheModule } from '@nestjs/cache-manager';
import { LogModule } from './log/log.module';
// import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    // CacheModule.register({ 
    //   isGlobal: true,
    //   store: redisStore,
    //   host: 'redis',
    //   port: 6379
    // }),
    AuthModule,
    UserModule,
    RecordModule,
    DeviceModule,
    LogModule,
  ], 
  controllers: [], 
  providers: [],
})
export class AppModule { }
