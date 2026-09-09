import { ArrowUpRight } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { statusLabels } from '@/lib/content';
import { getPublishedFinds } from '@/lib/data';

export const metadata = { title: 'Мои находки — ЗОХРА' };
export const dynamic = 'force-dynamic';
export default async function FindsPage() { const finds = await getPublishedFinds(); return <main><SiteHeader /><section className="page-intro"><p className="eyebrow">MY FINDS</p><h1>Мои находки</h1><p>Не каталог, а подборка интересных вещей. Наличие, оттенок и стоимость каждой позиции я проверю для вас лично.</p></section><section className="finds-list">{finds.map((item, index) => <article className="find-row" key={item.id}><div className="find-number">0{index + 1}</div><div className="find-row-image"><img src={item.images[0]} alt={`${item.brand} — ${item.name}`} /></div><div className="find-row-copy"><p className="eyebrow">{item.category}</p><h2>{item.brand}</h2><h3>{item.name}</h3><p>{item.description}</p><dl>{item.price && <div><dt>Ориентир</dt><dd>{item.price}</dd></div>}{item.sizes && <div><dt>Размеры</dt><dd>{item.sizes.join(' · ')}</dd></div>}{item.color && <div><dt>Цвет</dt><dd>{item.color}</dd></div>}<div><dt>Статус</dt><dd>{statusLabels[item.status]}</dd></div></dl><a className="button button-dark" href={`/request?item=${encodeURIComponent(`${item.brand} — ${item.name}`)}`}>Запросить <ArrowUpRight size={17} /></a></div></article>)}</section><SiteFooter /></main>; }
