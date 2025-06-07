'use server';

import { revalidatePath } from 'next/cache';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import FavoritesModel from '@/models/favoritesModel';
import ProductModel from '@/models/productModel';
import { getUserIdByTokenFromCookie } from '@/services/server-action/actions';
import { IApiResponse, IProduct } from '@/types/types';

export const getUserFavoritesIds = async () => {
  try {
    const userId = await getUserIdByTokenFromCookie();

    if (!userId)
      return {
        success: false,
        data: null,
        message: 'Пользователь не авторизован',
      };

    const { success, data: userFavorites } = await getFavoritesByUserId(userId);

    if (!success || !userFavorites)
      return {
        success: false,
        data: null,
        message: 'Избранное пустое',
      };

    return {
      success: true,
      data: userFavorites,
      message: 'Избранное получено',
    };
  } catch (error) {
    const result = serverErrorHandler(error);

    return {
      success: result.success,
      data: result.data,
      message: result.message,
      status: result.status,
    };
  }
};

export const getUserFavoritesProducts = async (): Promise<IApiResponse<IProduct[]>> => {
  try {
    const userId = await getUserIdByTokenFromCookie();

    if (!userId)
      return {
        success: false,
        data: null,
        message: 'Пользователь не авторизован',
      };

    const { success, data: userFavorites } = await getFavoritesByUserId(userId);

    if (!success || !userFavorites)
      return {
        success: false,
        data: null,
        message: 'Избранное пустое',
      };

    const products = await ProductModel.find({ _id: { $in: userFavorites } });

    if (!products)
      return {
        success: false,
        data: null,
        message: 'Товары не найдены',
      };

    return {
      success: true,
      data: JSON.parse(JSON.stringify(products)),
      message: 'Товары получены',
    };
  } catch (error) {
    const result = serverErrorHandler(error);

    return {
      success: result.success,
      data: result.data,
      message: result.message,
      status: result.status,
    };
  }
};

export const getFavoritesByUserId = async (userId: string) => {
  try {
    await connectMongoDB();
    const userFavorites = await FavoritesModel.findOne({ user: userId });

    if (!userFavorites)
      return {
        success: true,
        data: null,
        message: 'Избранное пустое',
      };

    return {
      success: true,
      data: JSON.parse(JSON.stringify(userFavorites.favorites)) as string[],
      message: 'Избранное получено',
    };
  } catch (error) {
    const result = serverErrorHandler(error);

    return {
      success: result.success,
      data: result.data,
      message: result.message,
      status: result.status,
    };
  }
};

export const toggleFavorite = async (productId: string) => {
  if (!productId) return { success: false, message: 'Не передан productId' };
  try {
    await connectMongoDB();
    const userId = await getUserIdByTokenFromCookie();
    if (!userId)
      return { success: false, data: { isAuth: false }, message: 'Пользователь не авторизован' };

    let message = 'Добавлено в избранное';
    revalidatePath('/cabinet/favorites');

    const userFavorites = await FavoritesModel.findOne({ user: userId });
    if (!userFavorites) {
      await FavoritesModel.create({ user: userId, favorites: [productId] });
      return { success: true, message };
    }

    if (userFavorites.favorites.includes(productId)) {
      await FavoritesModel.findByIdAndUpdate(userFavorites._id, {
        $pull: { favorites: productId },
      });
      message = 'Удаленно из избранного';
      return { success: true, message };
    } else {
      await FavoritesModel.findByIdAndUpdate(userFavorites._id, {
        $push: { favorites: productId },
      });
      return { success: true, message };
    }
  } catch (error: any) {
    console.log(error.message);

    return { success: false, message: error.message };
  }
};
