import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) {}

    async signup(authCredentialDto: AuthCredentialDto) {
        return this.userService.signup(authCredentialDto);
    }

    async signin(authCredentialDto: AuthCredentialDto) {
        const user = await this.userService.validateUserPassword(authCredentialDto);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        delete user.password;

        return { user }
    }
}
