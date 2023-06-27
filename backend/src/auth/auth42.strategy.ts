import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Strategy } from "passport-oauth2";
import { stringify } from "querystring";
import { ConfigService } from "@nestjs/config";
import { UserService } from "@/users/services/users/user.service";
import { CreateUserDto } from "@/users/dtos/CreateUser.dto";
import { AuthService } from "@/auth/services/auth.service";

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, "auth42") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly http: HttpService
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
        client_id: configService.get<string>("CLIENT_ID"),
        redirect_uri: configService.get<string>("CALLBACK_URL"),
        response_type: "code",
        scope: ["public"],
      })}`,
      tokenURL: "https://api.intra.42.fr/oauth/token",
      scope: "public",
      clientID: configService.get<string>("CLIENT_ID"),
      clientSecret: configService.get<string>("CLIENT_SECRET"),
      callbackURL: configService.get<string>("CALLBACK_URL"),
    });
  }

  //FIXME
  async validate(accessToken: string): Promise<any> {
    const { data } = await this.http
      .get("https://api.intra.42.fr/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

      const isValid = await this.authService.validateAccessToken(accessToken);

      if (!isValid) {
        // Token is invalid or expired
        return null;
      }
  
      // Return the authenticated user
      return true;
  }
}
