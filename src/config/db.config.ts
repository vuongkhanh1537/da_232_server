import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'da-232',
    entities: [__dirname + '/../**/*.entity.ts'], 
    autoLoadEntities: true,
    synchronize: true,
}  