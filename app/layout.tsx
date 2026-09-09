import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const editorial = Cormorant_Garamond({ variable: '--font-editorial', subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const interfaceFont = Manrope({ variable: '--font-interface', subsets: ['cyrillic', 'latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://zokhra-personal-shopper.paxan4ikraul.chatgpt.site'),
  title: { default: 'ЗОХРА — персональный шоппер и байер', template: '%s | ЗОХРА' },
  description: 'Индивидуальный поиск оригинальных брендовых вещей, помощь с заказом и доставкой.',
  keywords: ['персональный шоппер', 'байер', 'подбор одежды', 'поиск брендовых вещей'],
  openGraph: {
    type: 'website', locale: 'ru_RU', siteName: 'ЗОХРА',
    title: 'ЗОХРА — персональный шоппер и байер',
    description: 'Вещи, которые сложно найти. Я найду их для вас.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${editorial.variable} ${interfaceFont.variable}`}>{children}</body></html>;
}
