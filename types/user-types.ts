export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: number;
  role: 'user' | 'admin';
  rating?: string;
  reviews?: number;
  favorites?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEditUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | number;
}

export interface iFavorites {
  user: IUser;
  favorites: string[];
}

export interface iFavoritesResponse {
  isAuth?: boolean;
}
