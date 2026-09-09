import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { getDb } from '@/db';
import { requests } from '@/db/schema';

const schema = z.object({ name: z.string().trim().min(2).max(100), contact: z.string().trim().min(3).max(200), link: z.string().max(1000).optional(), brand: z.string().max(200).optional(), itemName: z.string().max(300).optional(), size: z.string().max(100).optional(), color: z.string().max(100).optional(), message: z.string().max(2000).optional(), preferredContact: z.enum(['telegram', 'whatsapp', 'instagram']) });
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const parsed = schema.parse(Object.fromEntries([...form.entries()].filter(([key]) => key !== 'image').map(([key, value]) => [key, String(value)])));
    const image = form.get('image');
    let imageKey: string | null = null;
    if (image instanceof File && image.size > 0) {
      if (image.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) return Response.json({ error: 'Фото должно быть JPG, PNG или WebP до 8 МБ' }, { status: 400 });
      imageKey = `requests/${crypto.randomUUID()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      await env.FILES.put(imageKey, image.stream(), { httpMetadata: { contentType: image.type } });
    }
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await getDb().insert(requests).values({ id, customerName: parsed.name, contact: parsed.contact, link: parsed.link || null, brand: parsed.brand || null, requestedItem: parsed.itemName || null, size: parsed.size || null, color: parsed.color || null, message: parsed.message || null, preferredContact: parsed.preferredContact, imageKey, source: 'website', status: 'new', createdAt: now, updatedAt: now });
    return Response.json({ id, status: 'received' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: 'Проверьте обязательные поля' }, { status: 400 });
    console.error('Request submission failed', error);
    return Response.json({ error: 'Не удалось отправить запрос' }, { status: 500 });
  }
}
