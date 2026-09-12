export type FindItem = {
  id: string;
  brand: string;
  name: string;
  category?: string;
  description?: string;
  price?: string;
  sizes?: string[];
  color?: string;
  status: 'check' | 'request' | 'order';
  images: string[];
  published: boolean;
  sortOrder: number;
  createdAt: string;
};

export type ReviewEntry = {
  id: string;
  image: string;
  text: string;
  customerName?: string;
  date?: string;
  type: 'review' | 'order';
  published: boolean;
  sortOrder: number;
};

export const statusLabels: Record<FindItem['status'], string> = {
  check: 'Проверить наличие',
  request: 'По запросу',
  order: 'Под заказ',
};

export const editorialFinds: FindItem[] = [
  {
    id: 'miu-miu-wander',
    brand: 'Miu Miu',
    name: 'Кожаная сумка Wander',
    category: 'Сумки',
    description: 'Мягкая матлассе-кожа и узнаваемый силуэт. Уточню доступные оттенки и стоимость.',
    price: 'Цена по запросу',
    color: 'Коньячный',
    status: 'check',
    images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1400&q=88'],
    published: true,
    sortOrder: 1,
    createdAt: '2026-08-28',
  },
  {
    id: 'toteme-coat',
    brand: 'Toteme',
    name: 'Пальто из шерсти',
    category: 'Одежда',
    description: 'Спокойный объём, чистая линия плеча и состав, рассчитанный на долгую носку.',
    price: '≈ 1 250 €',
    sizes: ['34', '36', '38'],
    color: 'Кэмел',
    status: 'order',
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1400&q=88'],
    published: true,
    sortOrder: 2,
    createdAt: '2026-08-24',
  },
  {
    id: 'bottega-pouch',
    brand: 'Bottega Veneta',
    name: 'Клатч The Pouch',
    category: 'Сумки',
    description: 'Архивный оттенок и безупречное состояние — вариант с проверенной площадки.',
    price: 'Цена по запросу',
    color: 'Молочный',
    status: 'request',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=88'],
    published: true,
    sortOrder: 3,
    createdAt: '2026-08-18',
  },
  {
    id: 'fendi-monogram-sneakers',
    brand: 'Fendi',
    name: 'Кеды с узором FF',
    category: 'Обувь',
    description: 'Кеды из фирменного текстиля с контрастной белой подошвой. Уточню наличие нужного размера.',
    price: 'Цена по запросу',
    color: 'Коричневый / белый',
    status: 'check',
    images: ['/images/zokhra/fendi-sneakers.jpg'],
    published: true,
    sortOrder: 4,
    createdAt: '2026-08-12',
  },
  {
    id: 'gucci-crystal-sneakers',
    brand: 'Gucci',
    name: 'Кеды с кристаллами GG',
    category: 'Обувь',
    description: 'Текстильная модель с разноцветным узором GG из кристаллов и зелёной отделкой.',
    price: 'Цена по запросу',
    color: 'Молочный / зелёный',
    status: 'request',
    images: ['/images/zokhra/gucci-sneaker.jpg'],
    published: true,
    sortOrder: 5,
    createdAt: '2026-09-10',
  },
];

export const editorialReviews: ReviewEntry[] = [
  {
    id: 'review-1', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=86',
    text: 'Зохра нашла нужный размер через два дня и спокойно объяснила каждый этап заказа.', customerName: 'Алина', date: 'Август 2026', type: 'review', published: true, sortOrder: 1,
  },
  {
    id: 'order-1', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=86',
    text: 'Редкая сумка приехала именно в том состоянии, которое мы заранее согласовали.', customerName: 'Мария', date: 'Июль 2026', type: 'order', published: true, sortOrder: 2,
  },
  {
    id: 'review-2', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=86',
    text: 'Очень ценю честность: один вариант Зохра сама не рекомендовала и нашла лучше.', customerName: 'Диана', date: 'Июнь 2026', type: 'review', published: true, sortOrder: 3,
  },
];

export const defaultContacts = {
  whatsapp: 'https://wa.me/', telegram: 'https://t.me/', instagram: 'https://instagram.com/', email: 'hello@zokhra.ru', phone: '',
};
