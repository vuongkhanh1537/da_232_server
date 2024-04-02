import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    @ApiProperty()
    name: string;
}