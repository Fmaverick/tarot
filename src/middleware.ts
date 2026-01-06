import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 针对 /api 路由进行跨域处理
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin') || '';
    const host = request.headers.get('host');
    const isOptions = request.method === 'OPTIONS';

    // 基础跨域头
    const headers = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Api-Key',
      'Access-Control-Max-Age': '86400',
    };

    // 动态处理 Origin 和 Credentials
    if (origin && origin !== 'null') {
      Object.assign(headers, {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      });
    } else if (origin === 'null') {
      // 特殊处理 origin 为 'null' 的情况 (如某些移动端 WebView 或本地文件)
      Object.assign(headers, {
        'Access-Control-Allow-Origin': 'null',
        'Access-Control-Allow-Credentials': 'true',
      });
    } else {
      // 如果没有 origin (如服务器端请求)，允许所有
      Object.assign(headers, {
        'Access-Control-Allow-Origin': '*',
      });
    }

    // 处理 www 重定向问题：如果是非 www 域名请求 API，手动重定向并带上 CORS 头
    if (host === 'lumento.cloud') {
      const url = request.nextUrl.clone();
      url.hostname = 'www.lumento.cloud';
      return NextResponse.redirect(url, {
        status: 307,
        headers: headers,
      });
    }

    // 处理预检请求 (Preflight)
    if (isOptions) {
      return new NextResponse(null, {
        status: 204,
        headers: headers,
      });
    }

    const response = NextResponse.next();

    // 为所有 API 响应添加跨域头
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  return NextResponse.next();
}

// 匹配所有 API 路由
export const config = {
  matcher: '/api/:path*',
};
