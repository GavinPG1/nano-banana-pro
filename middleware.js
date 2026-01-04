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

  try {
    const auth = authHeader.split(' ')[1];
    // 使用 Buffer 解析 Base64
    const decoded = Buffer.from(auth, 'base64').toString();
    const [user, pass] = decoded.split(':');

    if (user === "admin" && pass === "GGboy2338") {
      return NextResponse.next(); 
    }
  } catch (e) {
    // 解析失败的处理
  }

  return new Response('Invalid credentials', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Site"' },
  });
}

// 匹配路径配置
export const config = {
  matcher: '/:path*',
};
