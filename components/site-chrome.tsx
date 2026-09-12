'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { defaultContacts } from '@/lib/content';
import { siteRoute } from '@/lib/site-path';

const links = [
  { href: siteRoute('/'), label: 'Главная' },
  { href: siteRoute('/finds'), label: 'Мои находки' },
  { href: siteRoute('/request'), label: 'Найду для вас' },
  { href: siteRoute('/about'), label: 'Обо мне' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand-lockup" href={siteRoute('/')} aria-label="Зохра — на главную"><strong>ЗОХРА</strong><span>PERSONAL SHOPPER / BUYER</span></a>
      <nav className="desktop-nav" aria-label="Основная навигация">{links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
      <a className="nav-cta" href={siteRoute('/request')}>Оставить запрос</a>
      <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>{open ? <X /> : <Menu />}</button>
      {open && <nav className="mobile-menu" id="mobile-menu" aria-label="Мобильная навигация">{links.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}<a className="button button-dark" href={siteRoute('/request')}>Оставить запрос</a></nav>}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-mark"><strong>ЗОХРА</strong><span>PERSONAL SHOPPER / BUYER</span></div>
      <nav aria-label="Навигация в подвале">{links.slice(1).map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
      <div className="footer-socials"><a href={defaultContacts.instagram}>Instagram</a><a href={defaultContacts.telegram}>Telegram</a><a href={defaultContacts.whatsapp}>WhatsApp</a></div>
      <p>© {new Date().getFullYear()} Зохра. Персональный поиск вещей.</p>
    </footer>
  );
}
