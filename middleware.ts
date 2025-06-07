import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { parse } from 'set-cookie-parser';

import { isTokenValid } from '@/lib/utils/utils';

import { userRefreshTokens } from '@/services/api/user';

export async function middleware(request: NextRequest) {
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

  const refreshResponse = await userRefreshTokens({
    headers: {
      Cookie: request.headers.get('cookie'),
    },
    withCredentials: true,
  });

  if (!refreshResponse.data?.success) {
    const response = pathname.startsWith('/cabinet')
      ? NextResponse.redirect(new URL('/authentication', request.nextUrl))
      : NextResponse.next({
          request: { headers },
        });

    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  }
  const setCookieHeader = refreshResponse.headers['set-cookie'];
  const parsedCookies = setCookieHeader ? parse(setCookieHeader) : ([] as any[]);

  for (const cookie of parsedCookies) {
    if (cookie.name === 'accessToken' || cookie.name === 'refreshToken') {
      request.cookies.set(cookie.name, cookie.value);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  for (const cookie of parsedCookies) {
    if (cookie.name === 'accessToken' || cookie.name === 'refreshToken') {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        path: cookie.path,
        expires: cookie.expires,
        secure: cookie.secure,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|image|icon.png|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
