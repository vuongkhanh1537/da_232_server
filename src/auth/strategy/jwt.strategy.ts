import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from "src/user/user.service";
import { JwtPayload } from "../jwt-payload.interface";
import { User } from "src/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_JWT || 'da232@BK',
        });
    }

    async validate(payload: JwtPayload) {
        const { id, username } = payload;
        const user = await this.userService.findUserById(id);

        if (!user) {
            throw new UnauthorizedException();
        }
        delete user.password;
        return user;
    }
}