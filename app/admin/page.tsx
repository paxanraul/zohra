import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin-dashboard';
import { hasAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Управление сайтом — ЗОХРА' };

export default async function AdminPage() {
  if (!await hasAdminSession()) redirect('/admin/login');
  return <AdminDashboard email="zohra" signOutPath="/api/admin/logout" />;
}
