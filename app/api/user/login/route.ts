import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';

import { connectMongoDB } from '@/lib/mongodb';
import { generateTokens, setExpireDay } from '@/lib/utils/utils';

import RefreshTokenModel from '@/models/refreshTokenModel';
import UserModel from '@/models/userModel';
import { IUser } from '@/types/user-types';

export async function POST(request: Request, response: Response) {
  try {
    await connectMongoDB();

    const { email, password } = await request.json();

    const user: IUser | null = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Неверный E-mail или пароль' },
        { status: 200 },
      );
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { success: false, message: 'Неверный E-mail или пароль' },
        { status: 200 },
      );
    }

    const { newAccessToken, newRefreshToken } = await generateTokens(user._id, user.email);

    const userIsHaveToken = await RefreshTokenModel.findOne({ user: user._id });

    if (userIsHaveToken) {
      await userIsHaveToken.updateOne({
        token: newRefreshToken,
      });
    } else {
      await RefreshTokenModel.create({
        token: newRefreshToken,
        user: user._id,
      });
    }

    
    const newHeaders = new Headers(response.headers);

    newHeaders.set(
      'set-cookie',
      `accessToken=${newAccessToken};path=/;expires=${setExpireDay(5)};HttpOnly;SameSite=Strict`,
    );
    newHeaders.append(
      'set-cookie',
      `refreshToken=${newRefreshToken};path=/;expires=${setExpireDay(5)};HttpOnly;SameSite=Strict`,
    );
    return NextResponse.json(
      { success: true, message: 'Вы авторизованы' },
      {
        headers: newHeaders,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Что-то пошло не так...', error: error.message },
      { status: 500 },
    );
  }
}
