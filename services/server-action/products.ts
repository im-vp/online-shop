'use server';

import { connectMongoDB } from '@/lib/mongodb';

import ProductModel from '@/models/productModel';
import { IProduct } from '@/types/types';

export const getProduct = async (slug: string) => {
  if (!slug) {
    return { data: null, success: false, message: 'товар не найден' };
  }

  try {
    await connectMongoDB();

    const product: IProduct | null = await ProductModel.findOne({ slug }).populate('category');

    if (!product) {
      return { data: null, success: false, message: 'товар не найден' };
    }

    return { data: JSON.parse(JSON.stringify(product)) as IProduct, success: true, message: 'Товар получен' };
  } catch (e: any) {
    return { data: null, success: false, message: e.message };
  }
};

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
