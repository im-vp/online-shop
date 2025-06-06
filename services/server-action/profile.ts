'use server';

import { revalidatePath } from 'next/cache';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import UserModel from '@/models/userModel';
import { getUserIdByTokenFromCookie, loginCheck } from '@/services/server-action/actions';
import { getUserFavoritesIds } from '@/services/server-action/favorites';
import { IEditUser } from '@/types/user-types';

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
  try {
    const isAuth = await loginCheck();
    let myFavorites = null;

    if (isAuth) {
      const { success, data } = await getUserFavoritesIds();

      if (success && data) myFavorites = data;
    }
    return { isAuth, myFavorites: myFavorites };
  } catch (error) {
    const result = serverErrorHandler(error);

    return { isAuth: false, myFavorites: null, message: result.message };
  }
};
