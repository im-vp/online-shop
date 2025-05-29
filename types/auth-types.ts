import { IUser } from '@/types/user-types';

export type TypeForm = 'authorization' | 'registration';

export interface IRegistrationBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
export interface IAuthorizationBody {
  email: string;
  password: string;
}
export interface IAuthorizationResponse {
  accessToken: string;
}
export interface IRefreshToken {
  token: string;
  user: IUser;
}
