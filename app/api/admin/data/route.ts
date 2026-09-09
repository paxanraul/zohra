import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/db';
import { findItemImages, findItems, requests, reviews, siteSettings } from '@/db/schema';
import { adminErrorResponse, requireAdmin } from '@/lib/admin';

const storedImageUrl = z.string().refine((value) => value.startsWith('/api/files/') || URL.canParse(value), 'Invalid image URL');
const itemSchema = z.object({ id: z.string().optional(), brand: z.string().min(1).max(200), name: z.string().min(1).max(300), category: z.string().max(200).optional(), description: z.string().max(2000).optional(), price: z.string().max(100).optional(), sizes: z.array(z.string()).optional(), color: z.string().max(100).optional(), status: z.enum(['check', 'request', 'order']), images: z.array(storedImageUrl).max(10), published: z.boolean(), sortOrder: z.number().int().min(0).max(10000) });
const reviewSchema = z.object({ id: z.string().optional(), image: storedImageUrl.or(z.literal('')), text: z.string().min(1).max(2000), customerName: z.string().max(100).optional(), date: z.string().max(100).optional(), type: z.enum(['review', 'order']), published: z.boolean(), sortOrder: z.number().int().min(0).max(10000) });
const requestStatuses = ['new', 'working', 'found', 'complete', 'cancelled'] as const;

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const [items, images, requestRows, reviewRows, settings] = await Promise.all([
      db.select().from(findItems).orderBy(asc(findItems.sortOrder)), db.select().from(findItemImages).orderBy(asc(findItemImages.sortOrder)), db.select().from(requests).orderBy(asc(requests.createdAt)), db.select().from(reviews).orderBy(asc(reviews.sortOrder)), db.select().from(siteSettings),
    ]);
    return Response.json({
      items: items.map((item) => ({ ...item, category: item.category ?? '', description: item.description ?? '', price: item.price ?? '', sizes: item.sizes ?? [], color: item.color ?? '', images: images.filter((image) => image.findItemId === item.id).map((image) => image.url) })),
      requests: requestRows.reverse(),
      reviews: reviewRows.map((review) => ({ ...review, image: review.imageUrl ?? '', customerName: review.customerName ?? '', date: review.date ?? '' })),
      settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value])),
    });
  } catch (error) { return adminErrorResponse(error); }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as { action?: string; [key: string]: unknown };
    const db = getDb();
    const now = new Date().toISOString();
    if (body.action === 'saveItem') {
      const item = itemSchema.parse(body.item); const id = item.id ?? crypto.randomUUID();
      await db.insert(findItems).values({ id, brand: item.brand, name: item.name, category: item.category || null, description: item.description || null, price: item.price || null, sizes: item.sizes ?? [], color: item.color || null, status: item.status, published: item.published, sortOrder: item.sortOrder, createdAt: now, updatedAt: now }).onConflictDoUpdate({ target: findItems.id, set: { brand: item.brand, name: item.name, category: item.category || null, description: item.description || null, price: item.price || null, sizes: item.sizes ?? [], color: item.color || null, status: item.status, published: item.published, sortOrder: item.sortOrder, updatedAt: now } });
      await db.delete(findItemImages).where(eq(findItemImages.findItemId, id));
      if (item.images.length) await db.insert(findItemImages).values(item.images.map((url, index) => ({ id: crypto.randomUUID(), findItemId: id, storageKey: url.startsWith('/api/files/') ? url.slice('/api/files/'.length) : url, url, alt: `${item.brand} — ${item.name}`, sortOrder: index, isCover: index === 0 })));
      return Response.json({ ok: true, id });
    }
    if (body.action === 'deleteItem') { const id = z.string().parse(body.id); await db.delete(findItems).where(eq(findItems.id, id)); return Response.json({ ok: true }); }
    if (body.action === 'setRequestStatus') { const id = z.string().parse(body.id); const status = z.enum(requestStatuses).parse(body.status); await db.update(requests).set({ status, updatedAt: now }).where(eq(requests.id, id)); return Response.json({ ok: true }); }
    if (body.action === 'saveReview') {
      const review = reviewSchema.parse(body.review); const id = review.id ?? crypto.randomUUID();
      await db.insert(reviews).values({ id, imageUrl: review.image || null, imageKey: review.image.startsWith('/api/files/') ? review.image.slice('/api/files/'.length) : null, additionalImages: [], text: review.text, customerName: review.customerName || null, date: review.date || null, type: review.type, published: review.published, sortOrder: review.sortOrder, createdAt: now, updatedAt: now }).onConflictDoUpdate({ target: reviews.id, set: { imageUrl: review.image || null, text: review.text, customerName: review.customerName || null, date: review.date || null, type: review.type, published: review.published, sortOrder: review.sortOrder, updatedAt: now } });
      return Response.json({ ok: true, id });
    }
    if (body.action === 'deleteReview') { const id = z.string().parse(body.id); await db.delete(reviews).where(eq(reviews.id, id)); return Response.json({ ok: true }); }
    if (body.action === 'saveSettings') {
      const settings = z.record(z.string(), z.string().max(3000)).parse(body.settings);
      await db.batch(Object.entries(settings).map(([key, value]) => db.insert(siteSettings).values({ key, value, updatedAt: now }).onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: now } })));
      return Response.json({ ok: true });
    }
    return Response.json({ error: 'Неизвестное действие' }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: 'Проверьте заполненные поля' }, { status: 400 });
    return adminErrorResponse(error);
  }
}
