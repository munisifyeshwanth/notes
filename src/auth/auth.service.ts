import { BadRequestException,ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
      ) {}

      async signUp(createUserDto: CreateUserDto): Promise<any> {
        // Check if user exists
        const userExists = await this.usersService.findByUsername(
          createUserDto.name,
        );
        if (userExists) {
          throw new BadRequestException('User already exists');
        }
    
        // Hash password
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(createUserDto.password,salt);
        const newUser = await this.usersService.create({
          ...createUserDto,
          password: hash,
        });
        const tokens = await this.getTokens(newUser._id, newUser.username);
        return tokens;
      }
    
      async signIn(data: AuthDto) {
        // Check if user exists
        const user = await this.usersService.findByUsername(data.username);
        if (!user) throw new BadRequestException('User does not exist');
        const passwordMatches = await bcrypt.compare(user.password, data.password);
        if (!passwordMatches)
          throw new BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user._id, user.username);
        return tokens;
      }
    
      async logout(userId: string) {
        this.usersService.update(userId, { refreshToken: null });
      }
    
      async getTokens(userId: string, username: string) {
        const [accessToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              username,
            },
            {
              secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
              expiresIn: '15m',
            },
          )
        ]);
    
        return {
          accessToken,
        };
      }
    
}
