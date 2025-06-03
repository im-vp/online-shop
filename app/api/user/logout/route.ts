import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

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
    const result = serverErrorHandler(error);

    return NextResponse.json(
      { success: result.success, message: result.message, error: result.error },
      { status: result.status },
    );
  }
}
