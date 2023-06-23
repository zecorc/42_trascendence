import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/services/users/users.service';
import { CreateUserDto } from '@/users/dtos/CreateUser.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Get('login')
  @Redirect(
    'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b98e607513499274306cbad301d8f128ca766c93ff76ec8a049c9a5c0b1acc6a&redirect_uri=https%3A%2F%2F127.0.0.1&response_type=code',
  )
  login() {}

  async validateAccessToken(accessToken: string): Promise<boolean> {
    const tokenInfoEndpoint = 'https://api.intra.42.fr/oauth/token/info';

    try {
      const response: AxiosResponse = await axios.get(tokenInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { active, exp } = response.data;

      // Check if the token is active and not expired
      if (active && exp > Date.now() / 1000) {
        return true; // Token is valid
      }
    } catch (error) {
      console.error('Error validating access token:', error);
    }

    return false; // Token is invalid or expired
  }

  @Get('callback')
  async handleCallback(@Req() request: Request,  @Res() response: Response) {
    const authorizationCode = request.query.code;

    const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    try {
      const response: AxiosResponse = await axios.post(tokenEndpoint, null, {
        params: {
          grant_type: 'authorization_code',
          code: authorizationCode,
          client_id: clientId,
          client_secret: clientSecret,
        },
      });

      const { access_token, expires_in, token_type } = response.data;

      // Validate the access token
      const isTokenValid = await this.validateAccessToken(access_token);

      if (isTokenValid) {

        response.cookie('access_token', access_token, { expires: 0, httpOnly: true });

        // Get user information using the access token
        const userResponse: AxiosResponse = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const user = userResponse.data;

        // Check if the user already exists in the database
        const existingUser = await this.usersService.getUserByEmail(user.email);

        if (existingUser) {
          return;

        } else {
          // If the user does not exist, create a new user
          const createUserDto: CreateUserDto = {
            // Extract the necessary user information from the user object
            email: user.email,
            username: user.login,
            password: '', 
            rank: 0, 
            status: 0,
          };

          const createdUser = await this.usersService.createUser(createUserDto);

          return
        }
      }
      else 
      {
        response.clearCookie('access_token');
        const authorizationCode = request.query.code;

        try {
          const response: AxiosResponse = await axios.post(tokenEndpoint, null, {
            params: {
              grant_type: 'authorization_code',
              code: authorizationCode,
              client_id: clientId,
              client_secret: clientSecret,
            },
          });

          const { access_token, expires_in, token_type } = response.data;
          response.cookie('access_token', access_token, { expires: 0, httpOnly: true });

            // Update the access token in your application's storage or cookies
            // with the newly obtained access_token value.
        } catch (error) {
            console.error('Error refreshing access token:', error.response.data);
          }
      }

    } catch (error) {
      // Log the error response received from the server
      console.error('Error exchanging authorization code for access token:', error.response.data);
      // Redirect the user to an error page or display an error message
      return { url: 'https://localhost:8000/error' };
    }
  }
}
