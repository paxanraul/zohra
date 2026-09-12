import { authenticateAdmin, adminSessionCookie, createAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const form = await request.formData();
  const login = String(form.get('login') ?? '');
  const password = String(form.get('password') ?? '');
  const failure = new URL('/admin/login?error=1', request.url);
  if (!await authenticateAdmin(login, password)) return Response.redirect(failure, 303);
  return new Response(null, { status: 303, headers: { Location: new URL('/admin', request.url).toString(), 'Set-Cookie': adminSessionCookie(await createAdminSession()) } });
}
