import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

export async function GET(request: Request, response: Response) {
  try {
    await connectMongoDB();

    const cookieStore = cookies();
    cookieStore.set('accessToken', '', {
      path: '/',
      expires: new Date(0), // Удалить
      httpOnly: true,
      sameSite: 'strict',
    });
    cookieStore.set('refreshToken', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      sameSite: 'strict',
    });

    return NextResponse.json({
      data: null,
      success: true,
      message: 'Вы вышли из аккаунта',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Что-то пошло не так...', error: error.message },
      { status: 500 },
    );
  }
}
