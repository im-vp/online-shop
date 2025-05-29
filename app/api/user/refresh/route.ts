import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { generateTokens, isTokenValid, parseJwt, setExpireDay } from '@/lib/utils/utils';

import { findRefreshTokenByUserId, updateRefreshToken } from '@/services/server-action/actions';

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const accessToken = request.cookies.get('accessToken');
    const refreshToken = request.cookies.get('refreshToken');

    if (accessToken && (await isTokenValid(accessToken.value))) {
      return NextResponse.json({
        success: true,
        message: 'Доступ разрешен',
      });
    }

    if (!refreshToken || !(await isTokenValid(refreshToken.value))) {
      return NextResponse.json(
        { success: false, message: 'Отсутствует или не валидный токен' },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const refreshTokenByUserId = await findRefreshTokenByUserId(refreshToken.value);

    if (!refreshTokenByUserId) {
      return NextResponse.json({ success: false, message: 'Не авторизован(Нет аккаунта)' });
    }

    const userId = parseJwt(refreshToken.value).id as string;
    const userEmail = parseJwt(refreshToken.value).email as string;

    const { newAccessToken, newRefreshToken } = await generateTokens(userId, userEmail);

    await updateRefreshToken(refreshTokenByUserId.token, newRefreshToken);

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
      { success: true, message: 'Токены обновлены' },
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
