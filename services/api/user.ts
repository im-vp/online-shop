import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { errorHandler } from '@/lib/utils/utils';

import { axiosInstance } from '@/services/api/instance';
import { IAuthorizationBody, IRegistrationBody } from '@/types/auth-types';
import { IApiResponse } from '@/types/types';

export const UserApi = {
  logout: async () => {
    try {
      const { data } = await axiosInstance.get<IApiResponse>('/user/logout');

      return data;
    } catch (error) {
      return { success: false, data: null, message: errorHandler(error) };
    }
  },
};

export const userRegistration = async (body: IRegistrationBody): Promise<IApiResponse> => {
  try {
    const { data } = await axiosInstance.post<IApiResponse>('/user/registration', {
      ...body,
    });

    return data;
  } catch (error) {
    return { success: false, data: null, message: errorHandler(error) };
  }
};

export const userLogin = async (body: IAuthorizationBody): Promise<IApiResponse> => {
  try {
    const { data } = await axiosInstance.post<IApiResponse>('/user/login', {
      ...body,
    });

    return data;
  } catch (error) {
    return { success: false, data: null, message: errorHandler(error) };
  }
};

export const userLoginCheck = async (config?: { [key: string]: any }): Promise<IApiResponse> => {
  try {
    const { data } = await axiosInstance.get<IApiResponse>('/user/login-check', config);

    return data;
  } catch (error) {
    return { success: false, data: null, message: errorHandler(error) };
  }
};

export const userRefreshTokens = async (
  config?: AxiosRequestConfig,
): Promise<{ data: IApiResponse | null; headers: any; error?: string }> => {
  try {
    const response = await axiosInstance.get<IApiResponse>('/user/refresh', config);

    return {
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    return {
      data: null,
      headers: {},
      error: errorHandler(error),
    };
  }
};
