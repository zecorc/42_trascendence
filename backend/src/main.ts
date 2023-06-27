import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { ConfigService } from "@nestjs/config";
import { AuthGuard42 } from "@/auth/auth.guard";
import { AuthService } from "./auth/services/auth.service";
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const auth42Strategy = app.get(AuthGuard42);

  const config = new DocumentBuilder()
    .setTitle("Transcendence")
    .setVersion("0.1")
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  document.components.securitySchemes = {
    auth42: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'OAuth2 Access Token',
    },
  };
  
  // Set the security requirements
  document.security = [
    {
      auth42: [], // For endpoints that require Auth42Strategy
    },
  ];
  

  // Apply the Auth42Strategy to the security scheme
  app.useGlobalGuards(new AuthGuard42(app.get(AuthService),  app.get(Reflector)));


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
  passport.use(AuthGuard42);
  app.use(cookieParser());

  await app.listen(8000);
}

bootstrap();
