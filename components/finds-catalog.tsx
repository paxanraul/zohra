'use client';

import { ArrowUpRight, X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { statusLabels, type FindItem } from '@/lib/content';

const categories = ['Все', 'Одежда', 'Обувь', 'Сумки', 'Другое'] as const;

function itemCategory(category?: string) {
  return category && categories.includes(category as (typeof categories)[number]) ? category : 'Другое';
}

export function FindsCatalog({ finds }: { finds: FindItem[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>('Все');
  const [selected, setSelected] = useState<FindItem | null>(null);
  const visible = active === 'Все' ? finds : finds.filter((item) => itemCategory(item.category) === active);

  const selectCategory = (category: (typeof categories)[number]) => {
    setActive(category);
  };

  return <>
    <nav className="find-categories" aria-label="Разделы находок">
      {categories.map((category) => {
        const isActive = active === category;
        const count = category === 'Все' ? finds.length : finds.filter((item) => itemCategory(item.category) === category).length;

        return <button key={category} type="button" className={isActive ? 'active' : ''} aria-pressed={isActive} aria-controls="finds-list" onClick={() => selectCategory(category)}>{category}<span>{count}</span></button>;
      })}
    </nav>
    <section className="finds-list" id="finds-list" aria-live="polite">
      {visible.map((item) => <article className="product-card" key={item.id}>
        <button type="button" className="product-card-button" onClick={() => setSelected(item)} aria-label={`Открыть ${item.brand} — ${item.name}`}>
          <span className="product-card-image"><img src={item.images[0]} alt={`${item.brand} — ${item.name}`} /></span>
          <span className="product-card-copy">
            <span className="product-card-category">{itemCategory(item.category)}</span>
            <span className="product-card-title">{item.brand} — {item.name}</span>
          </span>
        </button>
      </article>)}
      {!visible.length && <div className="finds-empty"><p className="eyebrow">СКОРО</p><h2>В этом разделе пока нет находок</h2><p>Можно оставить индивидуальный запрос — я поищу нужную вещь специально для вас.</p><a className="button button-dark" href="/request">Оставить запрос <ArrowUpRight size={17} /></a></div>}
    </section>

    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      {selected && <DialogContent className="product-dialog" showCloseButton={false}>
        <DialogClose className="product-dialog-close" aria-label="Закрыть"><X size={20} /><span>Закрыть</span></DialogClose>
        <div className="product-dialog-image"><img src={selected.images[0]} alt={`${selected.brand} — ${selected.name}`} /></div>
        <div className="product-dialog-copy">
          <p className="eyebrow">{itemCategory(selected.category)}</p>
          <DialogTitle className="product-dialog-title">{selected.brand}</DialogTitle>
          <p className="product-dialog-name">{selected.name}</p>
          {selected.description && <DialogDescription className="product-dialog-description">{selected.description}</DialogDescription>}
          <dl className="product-dialog-details">
            {selected.price && <div><dt>Ориентир</dt><dd>{selected.price}</dd></div>}
            {selected.sizes?.length ? <div><dt>Размеры</dt><dd>{selected.sizes.join(' · ')}</dd></div> : null}
            {selected.color && <div><dt>Цвет</dt><dd>{selected.color}</dd></div>}
            <div><dt>Статус</dt><dd>{statusLabels[selected.status]}</dd></div>
          </dl>
          <a className="button button-dark" href={`/request?item=${encodeURIComponent(`${selected.brand} — ${selected.name}`)}`}>Запросить <ArrowUpRight size={17} /></a>
        </div>
      </DialogContent>}
    </Dialog>
  </>;
}
