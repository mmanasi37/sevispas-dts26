import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === '/v1/docs') {
        request.nextUrl.pathname = '/v2/docs'
        return NextResponse.redirect(request.nextUrl);
    }

    // return NextResponse.redirect(new URL('/home', request.url));
}

export const config = {
    matcher: '/about/:path*',
}