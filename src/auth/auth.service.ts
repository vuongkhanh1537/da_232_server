import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signup(authCredentialDto: AuthCredentialDto) {
        return this.userService.signup(authCredentialDto);
    }

    async signin(authCredentialDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        const user = await this.userService.validateUserPassword(authCredentialDto);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { id: user.id, username: user.username }
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
