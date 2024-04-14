import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    @HttpCode(201)
    signup(@Body() authCredentialDto: AuthCredentialDto) {
        return this.authService.signup(authCredentialDto);
    }

    @Post('/signin')
    @HttpCode(200)
    signin(@Body() authCredentialDto: AuthCredentialDto) {
        return this.authService.signin(authCredentialDto);
    }
}
