import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { UsersModule } from "@/users/users.module";
import { HttpModule } from "@nestjs/axios";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env.development", // Specify the path to your .env.development file
    }),
    HttpModule,
    PassportModule,
    // ConfigModule,
    UsersModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
