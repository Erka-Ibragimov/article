import { HttpException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async register({ login, password }: AuthDto) {
    const existUser = await this.authRepository.findOneBy({
      login,
    });

    if (existUser)
      throw new HttpException('Такой пользователь уже существует', 404);

    const hashPassword = await hash(password, 3);

    const newUser = this.authRepository.create({
      login,
      password: hashPassword,
    });

    await this.authRepository.save(newUser, { reload: true });

    return {
      accessToken: await this.jwtService.signAsync({
        id: newUser.id,
        login: newUser.login,
      }),
    };
  }

  async login({ login, password }: AuthDto) {
    const existUser = await this.authRepository.findOneBy({
      login,
    });

    if (!existUser)
      throw new HttpException('Такой пользователь не существует', 404);
    console.log(password)
    console.log(existUser.password)
    const isPassEquals = await compare(password, existUser.password);

    if (!isPassEquals) throw new HttpException('Не правильный пароль!', 404);

    return {
        accessToken: await this.jwtService.signAsync({
          id: existUser.id,
          login: existUser.login,
        }),
      };
  }
}
