'use server';

import { revalidatePath } from 'next/cache';

import { connectMongoDB } from '@/lib/mongodb';

import UserModel from '@/models/userModel';
import { getUserIdByTokenFromCookie } from '@/services/server-action/actions';
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
