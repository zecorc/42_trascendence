import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { UsersModule } from "@/users/users.module";
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthGuard } from './auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env.development",
    }),
    HttpModule,
    PassportModule,
    UsersModule,
  ],
  providers: [AuthService, JwtAuthGuard], // Include JwtAuthGuard here
  exports: [AuthService, JwtAuthGuard], // Include JwtAuthGuard here
  controllers: [AuthController],
})
export class AuthModule {}
