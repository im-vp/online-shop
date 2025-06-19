import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import ReviewsModel from '@/models/reviewsModel';
import UserModel from '@/models/userModel';
import { updateRating } from '@/services/server-action/reviews';
import { IUser } from '@/types/user-types';

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const user: IUser | null = await UserModel.findOne({ _id: body.user });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Пользователь не найден' },
        {
          status: 400,
        },
      );
    }

    updateRating(body.productId, body.rating);

    await ReviewsModel.create({
      ...body,
      product: body.productId,
    });

    revalidateTag(`product-${body.productSlug}`);

    return NextResponse.json({ success: true, message: 'Отзыв оставлен' }, { status: 200 });
  } catch (error) {
    const result = serverErrorHandler(error);
    return NextResponse.json(result, { status: result.status });
  }
}
