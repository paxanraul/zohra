'use client';

import { Archive, ExternalLink, ImagePlus, Inbox, LayoutDashboard, LogOut, MessageSquareText, Plus, Save, Settings, Trash2, UserRound } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

type AdminItem = { id?: string; brand: string; name: string; category?: string; description?: string; price?: string; sizes?: string[]; color?: string; status: 'check' | 'request' | 'order'; images: string[]; published: boolean; sortOrder: number };
type AdminRequest = { id: string; customerName: string; contact: string; requestedItem?: string; link?: string; brand?: string; size?: string; color?: string; message?: string; preferredContact: string; imageKey?: string; status: string; createdAt: string };
type AdminReview = { id?: string; image: string; text: string; customerName?: string; date?: string; type: 'review' | 'order'; published: boolean; sortOrder: number };
type AdminData = { items: AdminItem[]; requests: AdminRequest[]; reviews: AdminReview[]; settings: Record<string, string> };

const blankItem: AdminItem = { brand: '', name: '', category: 'Одежда', description: '', price: '', sizes: [], color: '', status: 'check', images: [], published: false, sortOrder: 0 };
const blankReview: AdminReview = { image: '', text: '', customerName: '', date: '', type: 'review', published: false, sortOrder: 0 };
const requestLabels: Record<string, string> = { new: 'Новый', working: 'В работе', found: 'Найдено', complete: 'Завершено', cancelled: 'Отменено' };

export function AdminDashboard({ email, signOutPath }: { email: string; signOutPath: string }) {
  const [data, setData] = useState<AdminData>({ items: [], requests: [], reviews: [], settings: {} });
  const [item, setItem] = useState<AdminItem | null>(null);
  const [review, setReview] = useState<AdminReview | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => { const response = await fetch('/api/admin/data'); if (response.ok) setData(await response.json() as AdminData); }, []);
  useEffect(() => { void load(); }, [load]);

  const action = async (payload: Record<string, unknown>) => {
    setBusy(true); setNotice('');
    const response = await fetch('/api/admin/data', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({})) as { error?: string };
    setBusy(false);
    if (!response.ok) { setNotice(result.error ?? 'Не удалось сохранить'); return false; }
    setNotice('Изменения сохранены'); await load(); return true;
  };

  const upload = async (file: File, folder: string) => {
    const form = new FormData(); form.set('file', file); form.set('folder', folder); setBusy(true);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: form }); const result = await response.json() as { url?: string; error?: string }; setBusy(false);
    if (!response.ok || !result.url) { setNotice(result.error ?? 'Не удалось загрузить файл'); return null; }
    return result.url;
  };

  const saveItem = async () => { if (!item) return; if (await action({ action: 'saveItem', item })) setItem(null); };
  const saveReview = async () => { if (!review) return; if (await action({ action: 'saveReview', review })) setReview(null); };
  const saveSettings = async () => { await action({ action: 'saveSettings', settings: data.settings }); };

  return (
    <main className="admin-shell">
      <header className="admin-topbar"><div><strong>ЗОХРА</strong><span>Управление сайтом</span></div><div><span>{email}</span><a href="/" target="_blank">Открыть сайт <ExternalLink size={15} /></a><a href={signOutPath}>Выйти <LogOut size={15} /></a></div></header>
      <Tabs defaultValue="home" orientation="vertical" className="admin-tabs">
        <TabsList className="admin-sidebar" variant="line">
          <TabsTrigger value="home"><LayoutDashboard />Главная</TabsTrigger>
          <TabsTrigger value="finds"><Archive />Мои находки</TabsTrigger>
          <TabsTrigger value="requests"><Inbox />Запросы</TabsTrigger>
          <TabsTrigger value="reviews"><MessageSquareText />Отзывы и заказы</TabsTrigger>
          <TabsTrigger value="about"><UserRound />Обо мне</TabsTrigger>
          <TabsTrigger value="contacts"><Settings />Контакты</TabsTrigger>
          <TabsTrigger value="settings"><Settings />Настройки</TabsTrigger>
        </TabsList>
        <div className="admin-workspace">
          {notice && <div className="admin-notice" role="status">{notice}</div>}
          <TabsContent value="home"><AdminTitle eyebrow="ОБЗОР" title="Добрый день, Зохра" description="Здесь собраны заявки и всё, что опубликовано на сайте." /><div className="admin-stats"><article><span>{data.requests.filter((entry) => entry.status === 'new').length}</span><p>Новых запросов</p></article><article><span>{data.items.filter((entry) => entry.published).length}</span><p>Опубликовано находок</p></article><article><span>{data.reviews.filter((entry) => entry.published).length}</span><p>Историй на сайте</p></article></div><section className="admin-panel"><h2>Последние запросы</h2><RequestTable entries={data.requests.slice(0, 5)} onStatus={(id, status) => action({ action: 'setRequestStatus', id, status })} /></section></TabsContent>
          <TabsContent value="finds"><AdminTitle eyebrow="КОНТЕНТ" title="Мои находки" description="Добавляйте вещи, выбирайте раздел и управляйте публикацией." action={<button className="admin-button" onClick={() => setItem({ ...blankItem, sortOrder: data.items.length + 1 })}><Plus />Добавить находку</button>} />{item && <ItemEditor value={item} busy={busy} onChange={setItem} onCancel={() => setItem(null)} onSave={saveItem} onUpload={upload} />}<div className="admin-list">{data.items.map((entry) => <article key={entry.id}><img src={entry.images[0] || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=75'} alt="" /><div><p>{entry.brand}</p><h3>{entry.name}</h3><span>{entry.category || 'Другое'} · {entry.published ? 'Опубликовано' : 'Скрыто'} · #{entry.sortOrder}</span></div><div className="admin-row-actions"><button onClick={() => setItem(entry)}>Изменить</button><button className="danger" onClick={() => action({ action: 'deleteItem', id: entry.id })}><Trash2 /></button></div></article>)}</div></TabsContent>
          <TabsContent value="requests"><AdminTitle eyebrow="КЛИЕНТЫ" title="Запросы" description="Меняйте статус, чтобы видеть, на каком этапе находится каждый поиск." /><section className="admin-panel"><RequestTable entries={data.requests} onStatus={(id, status) => action({ action: 'setRequestStatus', id, status })} /></section></TabsContent>
          <TabsContent value="reviews"><AdminTitle eyebrow="СОЦИАЛЬНОЕ ДОКАЗАТЕЛЬСТВО" title="Отзывы и заказы" description="Публикуйте отзывы, скриншоты и фотографии доставленных заказов." action={<button className="admin-button" onClick={() => setReview({ ...blankReview, sortOrder: data.reviews.length + 1 })}><Plus />Добавить историю</button>} />{review && <ReviewEditor value={review} busy={busy} onChange={setReview} onCancel={() => setReview(null)} onSave={saveReview} onUpload={upload} />}<div className="admin-list">{data.reviews.map((entry) => <article key={entry.id}><img src={entry.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=300&q=75'} alt="" /><div><p>{entry.type === 'review' ? 'Отзыв' : 'Заказ'}</p><h3>{entry.text}</h3><span>{entry.published ? 'Опубликовано' : 'Скрыто'} · {entry.customerName}</span></div><div className="admin-row-actions"><button onClick={() => setReview(entry)}>Изменить</button><button className="danger" onClick={() => action({ action: 'deleteReview', id: entry.id })}><Trash2 /></button></div></article>)}</div></TabsContent>
          <TabsContent value="about"><AdminTitle eyebrow="ТЕКСТЫ" title="Обо мне" description="Редактируйте ключевые тексты без изменения структуры страницы." /><SettingsEditor settings={data.settings} keys={[['about_intro', 'Вступление'], ['selection_philosophy', 'Что я выбираю'], ['brands', 'Какие бренды ищу'], ['buying_sources', 'Где покупаю'], ['authenticity', 'Как проверяю оригинальность'], ['order_process', 'Как работаю с заказами']]} onChange={(settings) => setData({ ...data, settings })} onSave={saveSettings} busy={busy} /></TabsContent>
          <TabsContent value="contacts"><AdminTitle eyebrow="СВЯЗЬ" title="Контакты" description="Эти данные используются в кнопках и формах по всему сайту." /><SettingsEditor settings={data.settings} keys={[['whatsapp', 'WhatsApp'], ['telegram', 'Telegram'], ['instagram', 'Instagram'], ['email', 'Email'], ['phone', 'Телефон']]} onChange={(settings) => setData({ ...data, settings })} onSave={saveSettings} busy={busy} /></TabsContent>
          <TabsContent value="settings"><AdminTitle eyebrow="СИСТЕМА" title="Настройки" description="Основная подпись и служебные параметры сайта." /><SettingsEditor settings={data.settings} keys={[['site_tagline', 'Короткая подпись'], ['request_reply_time', 'Срок ответа'], ['notice', 'Сообщение для клиентов']]} onChange={(settings) => setData({ ...data, settings })} onSave={saveSettings} busy={busy} /></TabsContent>
        </div>
      </Tabs>
    </main>
  );
}

function AdminTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) { return <div className="admin-title"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>{action}</div>; }

function RequestTable({ entries, onStatus }: { entries: AdminRequest[]; onStatus: (id: string, status: string) => void }) { return entries.length ? <div className="request-table"><div className="request-table-head"><span>Клиент</span><span>Запрос</span><span>Дата</span><span>Статус</span></div>{entries.map((entry) => <div className="request-table-row" key={entry.id}><span><strong>{entry.customerName}</strong><small>{entry.contact}</small></span><span>{entry.requestedItem || entry.brand || 'Индивидуальный поиск'}<small>{entry.size && `Размер: ${entry.size}`}</small></span><span>{new Date(entry.createdAt).toLocaleDateString('ru-RU')}</span><select aria-label={`Статус запроса ${entry.customerName}`} value={entry.status} onChange={(event) => onStatus(entry.id, event.target.value)}>{Object.entries(requestLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>)}</div> : <div className="admin-empty"><Inbox /><h3>Запросов пока нет</h3><p>Новые обращения с сайта появятся здесь.</p></div>; }

function ItemEditor({ value, busy, onChange, onCancel, onSave, onUpload }: { value: AdminItem; busy: boolean; onChange: (value: AdminItem) => void; onCancel: () => void; onSave: () => void; onUpload: (file: File, folder: string) => Promise<string | null> }) {
  const field = (key: keyof AdminItem, next: unknown) => onChange({ ...value, [key]: next });
  return <section className="admin-editor"><div className="admin-editor-head"><h2>{value.id ? 'Редактировать находку' : 'Новая находка'}</h2><button onClick={onCancel}>Закрыть</button></div><div className="admin-form-grid"><label><span>Бренд *</span><input value={value.brand} onChange={(e) => field('brand', e.target.value)} /></label><label><span>Название *</span><input value={value.name} onChange={(e) => field('name', e.target.value)} /></label><label><span>Раздел</span><select value={value.category || 'Другое'} onChange={(e) => field('category', e.target.value)}><option>Одежда</option><option>Обувь</option><option>Сумки</option><option>Другое</option></select></label><label><span>Цена</span><input value={value.price ?? ''} onChange={(e) => field('price', e.target.value)} /></label><label><span>Размеры через запятую</span><input value={(value.sizes ?? []).join(', ')} onChange={(e) => field('sizes', e.target.value.split(',').map((part) => part.trim()).filter(Boolean))} /></label><label><span>Цвет</span><input value={value.color ?? ''} onChange={(e) => field('color', e.target.value)} /></label><label><span>Статус</span><select value={value.status} onChange={(e) => field('status', e.target.value)}><option value="check">Проверить наличие</option><option value="request">По запросу</option><option value="order">Под заказ</option></select></label><label><span>Порядок</span><input type="number" value={value.sortOrder} onChange={(e) => field('sortOrder', Number(e.target.value))} /></label><label className="admin-wide"><span>Описание</span><textarea rows={3} value={value.description ?? ''} onChange={(e) => field('description', e.target.value)} /></label></div><label className="admin-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={async (e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) { const url = await onUpload(file, 'finds'); if (url) field('images', [...value.images, url]); } }}><ImagePlus /><span>Перетащите фото сюда или выберите файл</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await onUpload(file, 'finds'); if (url) field('images', [...value.images, url]); } }} /></label>{value.images.length > 0 && <div className="admin-images">{value.images.map((url, index) => <button key={url} onClick={() => field('images', value.images.filter((_, imageIndex) => imageIndex !== index))}><img src={url} alt="" /><span>{index === 0 ? 'Обложка · удалить' : 'Удалить'}</span></button>)}</div>}<div className="admin-editor-footer"><label className="switch-label"><Switch checked={value.published} onCheckedChange={(checked) => field('published', checked)} />Опубликовать</label><button className="admin-button" disabled={busy || !value.brand || !value.name} onClick={onSave}><Save />Сохранить</button></div></section>;
}

function ReviewEditor({ value, busy, onChange, onCancel, onSave, onUpload }: { value: AdminReview; busy: boolean; onChange: (value: AdminReview) => void; onCancel: () => void; onSave: () => void; onUpload: (file: File, folder: string) => Promise<string | null> }) {
  const field = (key: keyof AdminReview, next: unknown) => onChange({ ...value, [key]: next });
  return <section className="admin-editor"><div className="admin-editor-head"><h2>{value.id ? 'Редактировать историю' : 'Новая история'}</h2><button onClick={onCancel}>Закрыть</button></div><div className="admin-form-grid"><label><span>Тип</span><select value={value.type} onChange={(e) => field('type', e.target.value)}><option value="review">Отзыв</option><option value="order">Заказ</option></select></label><label><span>Имя клиента</span><input value={value.customerName ?? ''} onChange={(e) => field('customerName', e.target.value)} /></label><label><span>Дата</span><input value={value.date ?? ''} onChange={(e) => field('date', e.target.value)} placeholder="Август 2026" /></label><label><span>Порядок</span><input type="number" value={value.sortOrder} onChange={(e) => field('sortOrder', Number(e.target.value))} /></label><label className="admin-wide"><span>Текст *</span><textarea rows={3} value={value.text} onChange={(e) => field('text', e.target.value)} /></label></div><label className="admin-dropzone"><ImagePlus /><span>{value.image ? 'Заменить изображение' : 'Добавить изображение'}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await onUpload(file, 'reviews'); if (url) field('image', url); } }} /></label>{value.image && <img className="admin-review-preview" src={value.image} alt="" />}<div className="admin-editor-footer"><label className="switch-label"><Switch checked={value.published} onCheckedChange={(checked) => field('published', checked)} />Опубликовать</label><button className="admin-button" disabled={busy || !value.text} onClick={onSave}><Save />Сохранить</button></div></section>;
}

function SettingsEditor({ settings, keys, onChange, onSave, busy }: { settings: Record<string, string>; keys: [string, string][]; onChange: (settings: Record<string, string>) => void; onSave: () => void; busy: boolean }) { return <section className="admin-panel settings-editor"><div className="admin-form-grid">{keys.map(([key, label]) => <label className={key.includes('about') || key.includes('philosophy') || key.includes('process') ? 'admin-wide' : ''} key={key}><span>{label}</span>{key.includes('about') || key.includes('philosophy') || key.includes('process') ? <textarea rows={4} value={settings[key] ?? ''} onChange={(e) => onChange({ ...settings, [key]: e.target.value })} /> : <input value={settings[key] ?? ''} onChange={(e) => onChange({ ...settings, [key]: e.target.value })} />}</label>)}</div><button className="admin-button" disabled={busy} onClick={onSave}><Save />Сохранить изменения</button></section>; }
