import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/common/public.decorator';

@Controller('auth')
export class AuthContoller {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() data: AuthDto) {
    return await this.authService.register(data);
  }

  @Public()
  @Post('/login')
  async login(@Body() data: AuthDto) {
    return await this.authService.login(data);
  }
}
