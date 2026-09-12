import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { getPublishedReviews } from '@/lib/data';

export const metadata = { title: 'Отзывы и заказы — ЗОХРА' };
export const dynamic = process.env.GITHUB_PAGES === 'true' ? 'force-static' : 'force-dynamic';
export default async function ReviewsPage() { const reviewEntries = await getPublishedReviews(); return <main><SiteHeader /><section className="page-intro"><p className="eyebrow">CLIENT NOTES</p><h1>Отзывы и заказы</h1><p>Немного историй вещей, которые уже нашли своих владельцев.</p></section><section className="reviews-masonry">{reviewEntries.map((review, index) => <article className={`review-tile review-tile-${index + 1}`} key={review.id}><img src={review.image} alt={review.type === 'order' ? 'Доставленный заказ' : 'История клиентки'} /><div><p className="eyebrow">{review.type === 'order' ? 'ЗАКАЗ' : 'ОТЗЫВ'} · 0{index + 1}</p><blockquote>«{review.text}»</blockquote><p>{review.customerName}<br /><span>{review.date}</span></p></div></article>)}</section><SiteFooter /></main>; }
