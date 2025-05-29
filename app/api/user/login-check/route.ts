import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { isTokenValid } from '@/lib/utils/utils';

import { isUserByIdToken } from '@/services/server-action/actions';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken');

    if (!accessToken || !(await isTokenValid(accessToken.value))) {
      return NextResponse.json(
        { success: false, message: 'Пользователь не авторизован' },
        {
          status: 401,
        },
      );
    }

    await connectMongoDB();

    const user = await isUserByIdToken(accessToken.value);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Не найден пользователь по токену' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: 'Пользователь авторизован' },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Что-то пошло не так...', error: error.message },
      { status: 500 },
    );
  }
}
