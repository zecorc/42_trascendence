import { Controller, Get, Redirect, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/services/users/user.service';
import { CreateUserDto } from '@/users/dtos/CreateUser.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Redirect(
    'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b98e607513499274306cbad301d8f128ca766c93ff76ec8a049c9a5c0b1acc6a&redirect_uri=https%3A%2F%2F127.0.0.1&response_type=code',
  )
  login() {}

  @Get('callback')
  async handleCallback(@Req() request: Request, @Res() response: Response) {
    
    const authorizationCode: any = request.query.code;

    const access_token = request.cookies.access_token;
    const isTokenValid = await this.authService.validateAccessToken(access_token);
    
    if (access_token && isTokenValid) {
      //const userResponse = await this.authService.getUserInfo(access_token);
      //const user = userResponse.data;
      //const existingUser = await this.usersService.getUserByEmail(user.email);
      return response.redirect('/dashboard'); // ?
    }
    
    const clientId = this.configService.get<string>('CLIENT_ID');
    const clientSecret = this.configService.get<string>('CLIENT_SECRET');

    if (access_token) {
      response.clearCookie('access_token');
    }

    try {
      const tokenResponse = await this.authService.exchangeAuthorizationCode(
        authorizationCode,
        clientId,
        clientSecret,
      );
      const { access_token, expires_in, token_type } = tokenResponse.data;
  
      response.cookie('access_token', access_token, { expires: new Date(0), httpOnly: true });
  
      try {
        const userResponse = await this.authService.getUserInfo(access_token);
        const user = userResponse.data;
  
        const existingUser = await this.usersService.getUserByEmail(user.email);
  
        if (existingUser) {
          return response.redirect('/dashboard'); // ??
        } else {
          const createUserDto: CreateUserDto = {
            email: user.email,
            username: user.login,
            password: '',
            rank: 0,
            status: 0,
          };
          
          const createdUser = await this.usersService.createUser(createUserDto);
          return response.redirect('/dashboard'); // ??
        }
      } catch (error) {
        console.error('Error retrieving user information or creating new user:', error);
        // Handle error, redirect to an error page
        return response.redirect('/error');
      }
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
      // Handle error, to an error page
      return response.redirect('/error');
    }
  }
}