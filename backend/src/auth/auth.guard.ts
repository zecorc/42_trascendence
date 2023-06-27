import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard42 extends AuthGuard('auth42') implements CanActivate {
  constructor(
    private authService: AuthService,
    private readonly reflector: Reflector,
    ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization; // Assuming the token is passed in the 'Authorization' header

    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

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
