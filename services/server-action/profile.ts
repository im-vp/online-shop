'use server';

import { revalidatePath } from 'next/cache';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import UserModel from '@/models/userModel';
import {
  getUserIdByTokenFromCookie,
  getUserProfile,
  loginCheck,
} from '@/services/server-action/actions';
import { getUserFavoritesIds } from '@/services/server-action/favorites';
import { IEditUser, IUserShort } from '@/types/user-types';

export const editUserProfile = async (userData: IEditUser) => {
  if (!userData) return { success: false, message: 'Нет данных для редактирования' };
  try {
    await connectMongoDB();

    const userId = await getUserIdByTokenFromCookie();

    if (!userId) return { success: false, message: 'Пользователь не авторизован' };

    await UserModel.findOneAndUpdate({ _id: userId }, userData);

    revalidatePath('/cabinet/profile-information');
    return { success: true, message: 'Профиль обновлен' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const fetchInitialUserData = async () => {
  const userObject: {
    favorites: string[] | null;
    profile: IUserShort | null;
  } = {
    favorites: null,
    profile: null,
  };

  try {
    const isAuth = await loginCheck();

    if (isAuth) {
      const [favorites, profile] = await Promise.all([getUserFavoritesIds(), getUserProfile()]);

      if (favorites.success && favorites.data) userObject.favorites = favorites.data;
      if (profile.success && profile.data)
        userObject.profile = {
          _id: profile.data._id,
          firstName: profile.data.firstName,
          lastName: profile.data.lastName,
          email: profile.data.email,
        };
    }
    return { isAuth, ...userObject };
  } catch (error) {
    const result = serverErrorHandler(error);

    return { isAuth: false, ...userObject, message: result.message };
  }
};
