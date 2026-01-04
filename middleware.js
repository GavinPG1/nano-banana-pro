const USERNAME = "admin";
const PASSWORD = "GGboy2338";

export async function onRequest(context) {
  const { request, next, env } = context;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return new Response('需要身份验证', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Site"' }
    });
  }

  const auth = authHeader.split(' ')[1];
  try {
    const [user, pass] = atob(auth).split(':');

    if (user === USERNAME && pass === PASSWORD) {
      // 验证通过，执行 next() 就会自动去抓取 Pages 里的静态资源
      return await next(); 
    }
  } catch (e) {
    // 基础鉴权解析失败的处理
  }

  return new Response('账号或密码错误', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Secure Site"' }
  });
}