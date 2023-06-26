import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { ConfigService } from "@nestjs/config";
import { Auth42Strategy } from "@/auth/auth42.strategy";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle("Transcendence")
    .setVersion("0.1")
    .addApiKey({type: 'apiKey', name: 'Api-Key', in: 'header'}, 'Api-Key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.use(
    session({
      cookie: {
        maxAge: parseInt(configService.get("COOKIE_MAX_AGE")),
      },
      secret: configService.get("COOKIE_SECRET"),
      resave: false,
      saveUninitialized: false, // save sessions only if user is logged in
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(Auth42Strategy);

  app.use(cookieParser());

  await app.listen(8000);
}

bootstrap();
