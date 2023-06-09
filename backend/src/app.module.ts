import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import entities from "./typeorm";
import { PassportModule } from "@nestjs/passport";
import { ChatModule } from "@/chats/chat.module";
import { UsersModule } from "@/users/users.module";

@Module({
  imports: [
    PassportModule.register({ session: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: +configService.get<number>("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
