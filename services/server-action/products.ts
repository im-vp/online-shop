import { connectMongoDB } from '@/lib/mongodb';

import ProductModel from '@/models/productModel';
import { IProduct } from '@/types/types';

export const getPopularProducts = async (limit = 5) => {
  try {
    await connectMongoDB();

    const products: IProduct[] = await ProductModel.find({})
      .sort({ 'rating.value': -1 })
      .limit(limit);

    if (!products) {
      return { data: [], success: false, message: 'товары не найдены' };
    }

    return { data: products, success: true, message: 'Популярные товары получены' };
  } catch (e: any) {
    return { data: [], success: false, message: e.message };
  }
};

export const getNewProducts = async (limit = 5) => {
  try {
    await connectMongoDB();

    const products: IProduct[] = await ProductModel.find({}).sort({ createdAt: -1 }).limit(limit);

    if (!products) {
      return { data: [], success: false, message: 'товары не найдены' };
    }

    return { data: products, success: true, message: 'Популярные товары получены' };
  } catch (e: any) {
    return { data: [], success: false, message: e.message };
  }
};
