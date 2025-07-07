import { clientErrorHandler } from '@/lib/utils/utils';

import { RequestOptions, apiFetch } from '@/services/api/instance';
import { IAuthorizationBody, IRegistrationBody } from '@/types/auth-types';
import { IApiResponse } from '@/types/types';

export const UserApi = {
  logout: async (): Promise<IApiResponse> => {
    try {
      const { body } = await apiFetch.get('/user/logout');

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  userRegistration: async (requestBody: IRegistrationBody): Promise<IApiResponse> => {
    try {
      const { body } = await apiFetch.post('/user/registration', {
        body: requestBody,
      });

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  userLogin: async (requestBody: IAuthorizationBody): Promise<IApiResponse> => {
    try {
      const { body } = await apiFetch.post('/user/login', {
        body: requestBody,
      });

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  userLoginCheck: async (config?: { [key: string]: any }): Promise<IApiResponse> => {
    try {
      const { body } = await apiFetch.get('/user/login-check', config);

      return body;
    } catch (error) {
      return clientErrorHandler(error);
    }
  },
  userRefreshTokens: async (
    options?: RequestOptions,
  ): Promise<{ success: boolean; headers: Headers; error?: any }> => {
    try {
      const { body, headers } = await apiFetch.get('/user/refresh', { ...options });

      return {
        success: body.success,
        headers: headers,
      };
    } catch (error) {
      return {
        success: false,
        headers: {} as Headers,
        error: (await clientErrorHandler(error)).error,
      };
    }
  },
};
