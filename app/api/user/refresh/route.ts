import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { generateTokens, isTokenValid, parseJwt, serverErrorHandler } from '@/lib/utils/utils';

import { COOKIE_LIFETIME } from '@/constants/server';
import { findRefreshTokenByUserId, updateRefreshToken } from '@/services/server-action/actions';

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const refreshToken = request.cookies.get('refreshToken');

    if (!refreshToken || !(await isTokenValid(refreshToken.value))) {
      return NextResponse.json(
        { success: false, message: 'Отсутствует или не валидный токен' },
        { status: 401 },
      );
    }

    await connectMongoDB();

    const dbToken = await findRefreshTokenByUserId(refreshToken.value);

    if (!dbToken) {
      return NextResponse.json(
        { success: false, message: 'Не авторизован(Нет аккаунта)' },
        { status: 401 },
      );
    }

    const userId = parseJwt(refreshToken.value).id as string;
    const userEmail = parseJwt(refreshToken.value).email as string;

    const { newAccessToken, newRefreshToken } = await generateTokens(userId, userEmail);

    await updateRefreshToken(dbToken.token, newRefreshToken);

    const response = NextResponse.json({ success: true, message: 'Токены обновлены' });

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
