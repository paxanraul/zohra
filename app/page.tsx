import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const dynamic = process.env.GITHUB_PAGES === 'true' ? 'force-static' : 'force-dynamic';

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">PERSONAL SHOPPER / BUYER</p><h1>Вещи, которые<br />сложно найти.<br /><em>Я найду их для вас.</em></h1><p className="hero-meta">Индивидуальный поиск <i /> Оригинальные бренды <i /> Доставка</p><div className="hero-actions"><a className="button button-dark" href="/request">Найти для меня <ArrowUpRight size={17} /></a><a className="text-link" href="/finds">Посмотреть подборки <ArrowDownRight size={16} /></a></div></div><figure className="hero-image-wrap"><img className="hero-image" src="/images/zokhra/shopping-bags.jpg" alt="Покупки клиентов Зохры из брендовых бутиков" /><figcaption>Каждый заказ — личный поиск</figcaption></figure></section>
      <section className="positioning" id="service"><p className="eyebrow">ПЕРСОНАЛЬНЫЙ СЕРВИС</p><div><h2>Поиск вещей<br /><em>по вашему запросу</em></h2><p className="lead">Помогаю найти оригинальные вещи, которые сложно купить самостоятельно: проверяю наличие, стоимость и помогаю с заказом и доставкой.</p></div><ol className="advantages"><li><span>01</span><h3>Индивидуальный поиск</h3><p>Ищу конкретную вещь под ваш запрос.</p></li><li><span>02</span><h3>Оригинальные бренды</h3><p>Работаю с проверенными магазинами и площадками.</p></li><li><span>03</span><h3>Доставка</h3><p>Помогаю организовать покупку и доставку.</p></li></ol></section>
      <section className="search-callout"><p className="eyebrow">ПОИСК ПО ВАШЕМУ ЖЕЛАНИЮ</p><h2>Не нашли<br />нужную вещь?</h2><div><p>Пришлите мне фото или ссылку.<br />Я проверю наличие и стоимость.</p><a className="button button-light" href="/request">Оставить запрос <ArrowUpRight size={17} /></a></div></section>
      <section className="orders-proof"><div className="section-heading"><p className="eyebrow">ИЗ РАБОТЫ ЗОХРЫ</p><h2>Заказы,<br /><em>найденные для клиентов</em></h2><p>Настоящие покупки и посылки, собранные по индивидуальным запросам.</p></div><div className="orders-gallery"><figure><img src="/images/zokhra/fendi-sneakers.jpg" alt="Кеды Fendi, найденные для клиента" /></figure><figure><img src="/images/zokhra/fendi-nike-boxes.jpg" alt="Коробки Fendi и Nike из заказов клиентов" /></figure><figure><img src="/images/zokhra/gucci-sneaker.jpg" alt="Кеды Gucci с кристаллами, найденные для клиента" /></figure></div></section>
      <section className="about-teaser" id="about"><div className="about-portrait"><img src="/images/zokhra/orders-stack.jpg" alt="Подготовленные Зохрой брендовые заказы" /></div><div className="about-copy"><p className="eyebrow">ОБО МНЕ</p><h2>Я не хочу продавать вам всё подряд.</h2><p>Я хочу находить вещи, которые действительно стоят своих денег — по качеству, актуальности и тому, как долго они останутся с вами.</p><a className="text-link" href="/about">Почему мне доверяют <ArrowUpRight size={16} /></a></div></section>
      <SiteFooter />
    </main>
  );
}
