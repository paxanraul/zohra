import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
import { hasAdminSession } from '@/lib/admin-auth';

export const metadata = { title: 'Управление сайтом — ЗОХРА' };

export default async function AdminPage() {
  if (process.env.GITHUB_PAGES === 'true') return <main className="admin-denied"><p className="eyebrow">ЗОХРА / ADMIN</p><h1>Админка доступна локально</h1><p>GitHub Pages не поддерживает защищённый вход и работу с базой данных.</p></main>;
  if (!await hasAdminSession()) redirect('/admin/login');
  return <AdminDashboard email="zohra" signOutPath="/api/admin/logout" />;
}
