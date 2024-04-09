import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from 'src/auth/dto/auth-credential.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async signup(authCredentialDto: AuthCredentialDto) {
        const { username, password, name } = authCredentialDto;

        const salt = await bcrypt.genSalt();
        const user = new User();
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.name = name? name : username;

        try {
            await user.save();
        } catch (err) {
            if (err.code == '23505') {
                throw new ConflictException('Username already exist');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async findUserById(id: number) {
        return await this.userRepository.findOne({where: {id}});
    }

    async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<User> {
        const { username, password } = authCredentialDto;

        const user = await this.userRepository.findOne({ where: {username}});

        if (user && await user.validatePassword(password)) {
            return user;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}
