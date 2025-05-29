'use server';

import { revalidatePath } from 'next/cache';

import FavoritesModel from '@/models/favoritesModel';
import ProductModel from '@/models/productModel';
import { getUserIdByTokenFromCookie } from '@/services/server-action/actions';
import { IProduct } from '@/types/types';

export const getUserFavoritesIds = async () => {
  const userId = await getUserIdByTokenFromCookie();

  if (!userId) return null;

  const userFavorites = await getFavoritesByUserId(userId);

  return userFavorites;
};

export const getUserFavoritesProducts = async (): Promise<IProduct[] | null> => {
  const userId = await getUserIdByTokenFromCookie();

  if (!userId) return null;

  const userFavorites = await getFavoritesByUserId(userId);

  if (!userFavorites) return null;

  const products = await ProductModel.find({ _id: { $in: userFavorites } });

  if (!products) return null;

  return products;
};

export const getFavoritesByUserId = async (userId: string) => {
  const userFavorites = await FavoritesModel.findOne({ user: userId });

  return userFavorites ? userFavorites.favorites : null;
};

export const toggleFavorite = async (productId: string) => {
  if (!productId) return { success: false, message: 'Не передан productId' };
  try {
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
