import { getChatGPTUser } from '@/app/chatgpt-auth';

export async function requireAdmin() {
  const user = await getChatGPTUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  const allowed = (process.env.ADMIN_EMAILS ?? '').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
  const isLocalAdmin = process.env.NODE_ENV !== 'production' && user.email.endsWith('@sites.test');
  if (!isLocalAdmin && !allowed.includes(user.email.toLowerCase())) throw new Error('FORBIDDEN');
  return user;
}

export function adminErrorResponse(error: unknown) {
  if (error instanceof Error && error.message === 'UNAUTHENTICATED') return Response.json({ error: 'Требуется вход' }, { status: 401 });
  if (error instanceof Error && error.message === 'FORBIDDEN') return Response.json({ error: 'Нет доступа' }, { status: 403 });
  return Response.json({ error: 'Не удалось выполнить действие' }, { status: 500 });
}
