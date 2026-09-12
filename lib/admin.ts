import { hasAdminSession } from '@/lib/admin-auth';

export async function requireAdmin() {
  if (!await hasAdminSession()) throw new Error('UNAUTHENTICATED');
  return true;
}

export function adminErrorResponse(error: unknown) {
  if (error instanceof Error && error.message === 'UNAUTHENTICATED') return Response.json({ error: 'Требуется вход' }, { status: 401 });
  if (error instanceof Error && error.message === 'FORBIDDEN') return Response.json({ error: 'Нет доступа' }, { status: 403 });
  return Response.json({ error: 'Не удалось выполнить действие' }, { status: 500 });
}
