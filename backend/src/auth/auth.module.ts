import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development', // Specify the path to your .env.development file
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
