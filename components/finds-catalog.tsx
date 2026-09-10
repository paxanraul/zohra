'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { statusLabels, type FindItem } from '@/lib/content';

const categories = ['Все', 'Одежда', 'Обувь', 'Сумки', 'Другое'] as const;

function itemCategory(category?: string) {
  return category && categories.includes(category as (typeof categories)[number]) ? category : 'Другое';
}

export function FindsCatalog({ finds }: { finds: FindItem[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>('Все');
  const visible = active === 'Все' ? finds : finds.filter((item) => itemCategory(item.category) === active);

  return <>
    <nav className="find-categories" aria-label="Разделы находок">
      {categories.map((category) => <button key={category} type="button" className={active === category ? 'active' : ''} aria-pressed={active === category} onClick={() => setActive(category)}>{category}<span>{category === 'Все' ? finds.length : finds.filter((item) => itemCategory(item.category) === category).length}</span></button>)}
    </nav>
    <section className="finds-list" aria-live="polite">
      {visible.map((item, index) => <article className="find-row" key={item.id}><div className="find-number">{String(index + 1).padStart(2, '0')}</div><div className="find-row-image"><img src={item.images[0]} alt={`${item.brand} — ${item.name}`} /></div><div className="find-row-copy"><p className="eyebrow">{itemCategory(item.category)}</p><h2>{item.brand}</h2><h3>{item.name}</h3><p>{item.description}</p><dl>{item.price && <div><dt>Ориентир</dt><dd>{item.price}</dd></div>}{item.sizes && <div><dt>Размеры</dt><dd>{item.sizes.join(' · ')}</dd></div>}{item.color && <div><dt>Цвет</dt><dd>{item.color}</dd></div>}<div><dt>Статус</dt><dd>{statusLabels[item.status]}</dd></div></dl><a className="button button-dark" href={`/request?item=${encodeURIComponent(`${item.brand} — ${item.name}`)}`}>Запросить <ArrowUpRight size={17} /></a></div></article>)}
      {!visible.length && <div className="finds-empty"><p className="eyebrow">СКОРО</p><h2>В этом разделе пока нет находок</h2><p>Можно оставить индивидуальный запрос — я поищу нужную вещь специально для вас.</p><a className="button button-dark" href="/request">Оставить запрос <ArrowUpRight size={17} /></a></div>}
    </section>
  </>;
}
