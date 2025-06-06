import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import UserModel from '@/models/userModel';
import { IUser } from '@/types/user-types';

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const user: IUser | null = await UserModel.findOne({ email: body.email });

    if (user) {
      return NextResponse.json(
        { success: false, message: 'Данный E-mail уже зарегистрирован' },
        {
          status: 400,
        },
      );
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.password, salt);

    await UserModel.create({
      ...body,
      password: hash,
    });

    return NextResponse.json(
      { success: true, message: 'Регистрация прошла успешно' },
      { status: 200 },
    );
  } catch (error) {
    const result = serverErrorHandler(error);

    return NextResponse.json(
      { success: result.success, message: result.message, error: result.error },
      { status: result.status },
    );
  }
}
