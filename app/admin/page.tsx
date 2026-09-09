import { chatGPTSignOutPath, requireChatGPTUser } from '@/app/chatgpt-auth';
import { AdminDashboard } from '@/components/admin-dashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Управление сайтом — ЗОХРА' };

export default async function AdminPage() {
  const user = await requireChatGPTUser('/admin');
  const allowed = (process.env.ADMIN_EMAILS ?? '').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
  const isLocalAdmin = process.env.NODE_ENV !== 'production' && user.email.endsWith('@sites.test');
  if (!isLocalAdmin && !allowed.includes(user.email.toLowerCase())) return <main className="admin-denied"><p className="eyebrow">ЗОХРА / ADMIN</p><h1>Доступ закрыт</h1><p>Этот аккаунт не добавлен в список администраторов.</p><a className="text-link" href={chatGPTSignOutPath('/admin')}>Выйти и войти другим аккаунтом</a></main>;
  return <AdminDashboard email={user.email} signOutPath={chatGPTSignOutPath('/')} />;
}
