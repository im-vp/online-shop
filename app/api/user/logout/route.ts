import { NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';

export async function GET(request: Request, response: Response) {
  try {
    await connectMongoDB();
    const newHeaders = new Headers(response.headers);

    newHeaders.set(
      'set-cookie',
      `accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
    );
    newHeaders.append(
      'set-cookie',
      `refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
    );
    return NextResponse.json(
      { data: null, success: true, message: 'Вы вышли из аккаунта' },
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
