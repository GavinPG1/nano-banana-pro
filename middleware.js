import { NextResponse } from 'next/server';

// 必须写 export function middleware，不能只写 export default
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
    const decoded = atob(auth); 
    const [user, pass] = decoded.split(':');

    if (user === "admin" && pass === "GGboy2338") {
      return NextResponse.next(); // 验证成功，放行
    }
  } catch (e) {}

  return new Response('Invalid credentials', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Site"' },
  });
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};