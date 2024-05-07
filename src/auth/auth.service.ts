import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signup(authCredentialDto: AuthCredentialDto) {
        return this.userService.signup(authCredentialDto);
    }

    async signin(authCredentialDto: AuthCredentialDto): Promise<{ user:User, accessToken: string }> {
        const user = await this.userService.validateUserPassword(authCredentialDto);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { id: user.id, username: user.username }
        const accessToken = await this.jwtService.sign(payload);
        delete user.password;
        return { user, accessToken };
    }
}
