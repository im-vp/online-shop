import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';

import { connectMongoDB } from '@/lib/mongodb';
import { generateTokens, serverErrorHandler } from '@/lib/utils/utils';

import { getCorsHeaders } from '@/constants/corsHeaders';
import { COOKIE_LIFETIME } from '@/constants/server';
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

    const response = NextResponse.json({ success: true, message: 'Вы авторизованы' });

    response.cookies.set('accessToken', newAccessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: COOKIE_LIFETIME.accessToken,
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: COOKIE_LIFETIME.refreshToken,
    });

    return response;
  } catch (error: any) {
    const result = serverErrorHandler(error);

    return NextResponse.json(
      { success: result.success, message: result.message, error: result.error },
      { status: result.status },
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  const corsHeaders = { headers: getCorsHeaders(origin) };
  return NextResponse.json({}, corsHeaders);
}
