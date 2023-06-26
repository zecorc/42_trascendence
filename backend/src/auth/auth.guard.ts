import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization; // Assuming the token is passed in the 'Authorization' header

    if (!token) {
      return false;
    }

    try {
      const isValidToken = await this.authService.validateAccessToken(token);
      if (isValidToken) {
        return true;
      }
    } catch (error) {
      console.error('Error validating access token:', error);
    }

    return false; // Token is invalid or expired
  }
}
