import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { Request } from 'express';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('login')
  @Redirect('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-b98e607513499274306cbad301d8f128ca766c93ff76ec8a049c9a5c0b1acc6a&redirect_uri=https%3A%2F%2F127.0.0.1&response_type=code')
  login() {}
  @Get('callback')
  async handleCallback(@Req() request: Request) {
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
      // Use the access token for further API requests or store it securely
  
      // Redirect the user to another page or perform additional actions
    } catch (error) {
      // Log the error response received from the server
      console.error('Error exchanging authorization code for access token:', error.response.data);
      // Redirect the user to an error page or display an error message
      return { url: 'https://localhost:8000/error' };
    }
  }  
}

