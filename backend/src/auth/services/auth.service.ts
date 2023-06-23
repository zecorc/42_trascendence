import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {  

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

    async exchangeAuthorizationCode(
        authorizationCode: string,
        clientId: string,
        clientSecret: string,
        ): Promise<AxiosResponse> {
        const tokenEndpoint = 'https://api.intra.42.fr/oauth/token';

        try {
            const response: AxiosResponse = await axios.post(tokenEndpoint, null, {
            params: {
                grant_type: 'authorization_code',
                code: authorizationCode,
                client_id: clientId,
                client_secret: clientSecret,
            },
            });

            return response;
        } catch (error) {
            console.error('Error exchanging authorization code for access token:', error.response.data);
            throw error;
        }
    }

    async getUserInfo(accessToken: string): Promise<AxiosResponse> {
        const userInfoEndpoint = 'https://api.intra.42.fr/v2/me';

        try {
            const response: AxiosResponse = await axios.get(userInfoEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            });

            return response;
        } catch (error) {
            console.error('Error retrieving user information:', error);
            throw error;
        }
    }
}
