import { NextResponse } from 'next/server';

// 必须导出名为 middleware 的函数
export function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new Response('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Site"' },
    });
  }

  const auth = authHeader.split(' ')[1];
  const decoded = atob(auth); // 在 Edge Runtime 中可以直接使用 atob
  const [user, pass] = decoded.split(':');

  if (user === "admin" && pass === "GGboy2338") {
    return NextResponse.next();
  }

  return new Response('Invalid credentials', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Site"' },
  });
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了特定的静态文件
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};