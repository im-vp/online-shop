'use server';

import { connectMongoDB } from '@/lib/mongodb';
import { errorHandler, serverErrorHandler } from '@/lib/utils/utils';

import ProductModel from '@/models/productModel';
import ReviewsModel from '@/models/reviewsModel';
import { IProduct, IReviews } from '@/types/types';

export const getReviewsByProductId = async (productId: string) => {
  try {
    await connectMongoDB();
    const reviews = await ReviewsModel.find({ product: productId })
      .populate('user')
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(reviews)) as IReviews[],
      message: 'Отзывы о товаре',
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

export const updateRating = async (productId: string, userRating: number) => {
  await connectMongoDB();

  const product: IProduct | null = await ProductModel.findOne({ _id: productId });

  if (!product) return false;

  if (product.rating.value === 0 && product.rating.reviewCount === 0) {
    await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        'rating.value': userRating,
        'rating.reviewCount': 1,
      },
    );
  } else {
    const oldRating = product.rating.value;
    const reviewCount = product.rating.reviewCount;
    const newValue = userRating;

    const newRating = (oldRating * reviewCount + newValue) / (reviewCount + 1);

    await ProductModel.findOneAndUpdate(
      { _id: productId },
      { 'rating.value': newRating.toFixed(1), 'rating.reviewCount': reviewCount + 1 },
    );
  }
};
