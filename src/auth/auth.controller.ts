import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signup(@Body() authCredentialDto: AuthCredentialDto) {
        return this.authService.signup(authCredentialDto);
    }

    @Post('/signin')
    signin(@Body() authCredentialDto: AuthCredentialDto) {
        return this.authService.signin(authCredentialDto);
    }
}
