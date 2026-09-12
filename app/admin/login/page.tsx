import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Вход в админку — ЗОХРА' };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await hasAdminSession()) redirect('/admin');
  const { error } = await searchParams;
  return <main className="admin-login"><section><p className="eyebrow">ЗОХРА / ADMIN</p><h1>Вход в<br />админку</h1><p>Управление находками, запросами и настройками сайта.</p><form action="/api/admin/login" method="post"><label><span>Логин</span><input name="login" autoComplete="username" required /></label><label><span>Пароль</span><input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="admin-login-error" role="alert">Неверный логин или пароль.</p>}<button className="admin-button" type="submit">Войти</button></form></section></main>;
}
