'use server';

import { cookies } from 'next/headers';

import { connectMongoDB } from '@/lib/mongodb';
import {
  getCartTotalPrice,
  getCartTotalQuantity,
  isTokenValid,
  parseJwt,
  serverErrorHandler,
} from '@/lib/utils/utils';

import ProductModel from '@/models/productModel';
import RefreshTokenModel from '@/models/refreshTokenModel';
import UserModel from '@/models/userModel';
import { CartCookieValues, IApiResponse, ICartProduct } from '@/types/types';
import { IUser } from '@/types/user-types';

export const getTokensFormCookie = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const refreshToken = cookieStore.get('refreshToken');

  return { accessToken, refreshToken };
};

export const loginCheck = async () => {
  const accessToken = cookies().get('accessToken');

  return accessToken && (await isTokenValid(accessToken.value)) ? true : false;
};

export const isUserByIdToken = async (token: string) => {
  const id = parseJwt(token).id;

  if (!id) return false;
  await connectMongoDB();

  const user: IUser | null = await UserModel.findOne({
    _id: id,
  });

  return user ? true : false;
};

export const findRefreshTokenByUserId = async (token: string) => {
  const userId = parseJwt(token).id;

  if (!userId) return false;
  await connectMongoDB();

  const refreshToken = await RefreshTokenModel.findOne({
    user: userId,
  });

  return refreshToken || false;
};

export const updateRefreshToken = async (oldToken: string, newToken: string) => {
  if (!oldToken || !newToken) return;
  await connectMongoDB();
  await RefreshTokenModel.updateOne(
    {
      token: oldToken,
    },
    {
      token: newToken,
    },
  );
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  if (!id) return null;
  await connectMongoDB();
  const user = await UserModel.findOne({ _id: id }).select('-password');

  return user ? JSON.parse(JSON.stringify(user)) : null;
};

export const getUserIdByTokenFromCookie = async () => {
  const accessToken = cookies().get('accessToken');

  if (accessToken && (await isTokenValid(accessToken.value))) {
    const userId = parseJwt(accessToken.value).id as string;

    return userId;
  }
};

export const getUserProfile = async (): Promise<IApiResponse<IUser>> => {
  try {
    const id = await getUserIdByTokenFromCookie();

    if (!id)
      return {
        success: false,
        data: null,
        message: 'Нет токена в куках',
      };

    const user = await getUserById(id);

    if (!user)
      return {
        success: false,
        data: null,
        message: 'Пользователь не найден',
      };

    return {
      success: true,
      data: JSON.parse(JSON.stringify(user)),
      message: 'Пользователь найден',
    };
  } catch (error) {
    const result = serverErrorHandler(error);

    return {
      success: result.success,
      data: result.data,
      message: result.message,
    };
  }
};

export const getCartProducts = async () => {
  const cart = cookies().get('cart');

  if (!cart) return false;

  try {
    connectMongoDB();

    const cartParse: CartCookieValues[] = JSON.parse(cart.value);

    const products = await ProductModel.find({
      _id: { $in: cartParse.map((item: CartCookieValues) => item.id) },
    }).lean();

    const productsCart: ICartProduct[] = products.map((product) => ({
      ...product,
      quantity: Number(cartParse.find((item) => item.id === product._id.toString())?.quantity) || 1,
      totalPrice:
        product.price *
        (Number(cartParse.find((item) => item.id === product._id.toString())?.quantity) || 1),
    }));

    return JSON.parse(
      JSON.stringify({
        products: productsCart,
        totalQuantity: getCartTotalQuantity(productsCart),
        totalSum: getCartTotalPrice(productsCart),
      }),
    );
  } catch (error) {
    return false;
  }
};
export const getCartQuantity = async () => {
  const cart = cookies().get('cart');

  if (!cart) return 0;

  const cartParse: CartCookieValues[] = JSON.parse(cart.value);

  return cartParse.reduce((total, product) => total + Number(product.quantity), 0);
};
