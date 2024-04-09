import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class DeviceThresholdSettingDto {
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    maxThreshold: number;
    
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    minThreshold: number;
}