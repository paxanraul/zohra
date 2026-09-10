import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { FindsCatalog } from '@/components/finds-catalog';
import { getPublishedFinds } from '@/lib/data';

export const metadata = { title: 'Мои находки — ЗОХРА' };
export const dynamic = 'force-dynamic';
export default async function FindsPage() { const finds = await getPublishedFinds(); return <main><SiteHeader /><section className="page-intro"><p className="eyebrow">MY FINDS</p><h1>Мои находки</h1><p>Не каталог, а подборка интересных вещей. Наличие, оттенок и стоимость каждой позиции я проверю для вас лично.</p></section><FindsCatalog finds={finds} /><SiteFooter /></main>; }
