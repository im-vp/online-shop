import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isTokenValid, parseCookiesString, setExpireDay } from '@/lib/utils/utils';

import { axiosInstance } from '@/services/api/instance';
import { userLoginCheck } from '@/services/api/user';

export async function middleware(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  const headers = new Headers(request.headers);
  headers.set('x-url', request.url);

  if (!accessToken && !refreshToken) {
    if (pathname.startsWith('/cabinet')) {
      return NextResponse.redirect(new URL('/authentication', request.nextUrl));
    } else {
      return NextResponse.next({
        request: {
          headers,
        },
      });
    }
  }

  if (accessToken && (await isTokenValid(accessToken.value))) {
    if (pathname.startsWith('/authentication')) {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  const { success } = await userLoginCheck();

  if (!success) {
    const data = await axiosInstance.get('/user/refresh').catch((error) => {});

    if (data && data.headers['set-cookie']) {
      //@ts-ignore
      const cookieList = data.headers['set-cookie'] as string;

      const cookieRequest = parseCookiesString(cookieList);

      cookieRequest.forEach((item, index) => {
        if (index === 0) {
          headers.set(
            'cookie',
            `${item.cookieName}=${item.cookieValue}; path=/; max-age=${setExpireDay(5)}; HttpOnly;`,
          );
        } else {
          headers.append(
            'cookie',
            `${item.cookieName}=${item.cookieValue}; path=/; max-age=${setExpireDay(5)}; HttpOnly;`,
          );
        }
      });

      const nextResponse = NextResponse.next({
        request: {
          headers,
        },
      });
    
      const cookieResponse = parseCookiesString(cookieList);

      cookieResponse.forEach((item) => {
        nextResponse.cookies.set(item.cookieName, item.cookieValue, {
          httpOnly: true,
          path: '/',
          maxAge: setExpireDay(5),
        });
      });

      return nextResponse;
    }

    if (pathname.startsWith('/cabinet')) {
      return NextResponse.redirect(new URL('/authentication', request.nextUrl));
    }
  }

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|image|icon.png|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
