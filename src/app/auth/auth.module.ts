import { Module } from '@nestjs/common';
import { AuthContoller } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [AuthContoller],
  providers: [AuthService],
})
export class AuthModule {}
