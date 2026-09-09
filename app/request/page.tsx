import { Suspense } from 'react';
import { RequestForm } from '@/components/request-form';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata = { title: 'Найду для вас — ЗОХРА' };
export default function RequestPage() { return <main><SiteHeader /><section className="request-page"><div className="request-intro"><p className="eyebrow">FIND IT FOR ME</p><h1>Расскажите,<br /><em>что вы ищете</em></h1><p>Пришлите фото или ссылку. Я проверю наличие и стоимость, предложу варианты и объясню условия заказа.</p><div className="contact-inline"><a href="https://wa.me/">WhatsApp</a><a href="https://t.me/">Telegram</a><a href="https://instagram.com/">Instagram</a></div></div><Suspense fallback={<div className="form-loading">Форма загружается…</div>}><RequestForm /></Suspense></section><SiteFooter /></main>; }
