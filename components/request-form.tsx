'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUpRight, Check, ImagePlus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const requestSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  contact: z.string().min(3, 'Укажите удобный контакт'),
  link: z.string().optional(),
  brand: z.string().optional(),
  itemName: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  message: z.string().max(2000).optional(),
  preferredContact: z.enum(['telegram', 'whatsapp', 'instagram']),
});

type RequestValues = z.infer<typeof requestSchema>;

export function RequestForm({ compact = false }: { compact?: boolean }) {
  const searchParams = useSearchParams();
  const selectedItem = searchParams.get('item') ?? '';
  const [image, setImage] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: { itemName: selectedItem, preferredContact: 'telegram' },
  });

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'submit_personal_shopper_request',
      title: 'Отправить запрос Зохре',
      description: 'Отправляет запрос на индивидуальный поиск вещи и обновляет форму подтверждением.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 }, contact: { type: 'string', minLength: 3 }, link: { type: 'string' }, brand: { type: 'string' }, itemName: { type: 'string' }, size: { type: 'string' }, color: { type: 'string' }, message: { type: 'string' }, preferredContact: { type: 'string', enum: ['telegram', 'whatsapp', 'instagram'] },
        },
        required: ['name', 'contact', 'preferredContact'], additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        const values = requestSchema.parse(input);
        const body = new FormData(); Object.entries(values).forEach(([key, value]) => body.set(key, value ?? ''));
        const response = await fetch('/api/requests', { method: 'POST', body });
        const result = await response.json() as { id?: string; error?: string };
        if (!response.ok) throw new Error(result.error ?? 'Request submission failed');
        setSent(true);
        return { requestId: result.id, status: 'received' };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const submit = async (values: RequestValues) => {
    setServerError('');
    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => body.set(key, value ?? ''));
    if (image) body.set('image', image);
    const response = await fetch('/api/requests', { method: 'POST', body });
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      setServerError(payload?.error ?? 'Не удалось отправить запрос. Попробуйте ещё раз.');
      return;
    }
    setSent(true);
    reset();
    setImage(null);
  };

  if (sent) return <div className="request-success" role="status"><Check aria-hidden="true" /><p className="eyebrow">ЗАПРОС ПРИНЯТ</p><h2>Спасибо. Я скоро свяжусь с вами.</h2><button className="text-link" type="button" onClick={() => setSent(false)}>Отправить ещё один запрос</button></div>;

  return (
    <form className={`request-form ${compact ? 'request-form-compact' : ''}`} onSubmit={handleSubmit(submit)}>
      {selectedItem && <p className="selected-item">Вы интересуетесь: <strong>{selectedItem}</strong></p>}
      <div className="form-grid">
        <label><span>Имя *</span><input {...register('name')} autoComplete="name" placeholder="Как к вам обращаться" />{errors.name && <small>{errors.name.message}</small>}</label>
        <label><span>Телефон / контакт *</span><input {...register('contact')} autoComplete="tel" placeholder="@username или +7…" />{errors.contact && <small>{errors.contact.message}</small>}</label>
        <label><span>Ссылка на вещь</span><input {...register('link')} inputMode="url" placeholder="https://" /></label>
        <label><span>Бренд</span><input {...register('brand')} placeholder="Например, Miu Miu" /></label>
        <label><span>Название вещи</span><input {...register('itemName')} placeholder="Сумка, жакет, обувь…" /></label>
        <label><span>Размер</span><input {...register('size')} placeholder="Ваш размер" /></label>
        <label><span>Цвет</span><input {...register('color')} placeholder="Желаемый оттенок" /></label>
        <label><span>Связаться через</span><select {...register('preferredContact')}><option value="telegram">Telegram</option><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option></select></label>
      </div>
      <label className="full-field"><span>Комментарий</span><textarea {...register('message')} rows={3} placeholder="Расскажите о пожеланиях, бюджете или сроках" /></label>
      <label className="file-field"><ImagePlus aria-hidden="true" size={20} /><span>{image ? image.name : 'Прикрепить фото вещи'}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /></label>
      {serverError && <p className="form-error" role="alert">{serverError}</p>}
      <div className="form-submit"><p>Наличие и цены проверяются индивидуально: ассортимент брендов меняется ежедневно.</p><button className="button button-dark" disabled={isSubmitting} type="submit">{isSubmitting ? 'Отправляем…' : 'Отправить запрос'} <ArrowUpRight size={17} /></button></div>
    </form>
  );
}
