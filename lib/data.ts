import { asc, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { findItemImages, findItems, reviews } from '@/db/schema';
import { editorialFinds, editorialReviews, type FindItem, type ReviewEntry } from '@/lib/content';

export async function getPublishedFinds(): Promise<FindItem[]> {
  try {
    const db = getDb();
    const rows = await db.select().from(findItems).where(eq(findItems.published, true)).orderBy(asc(findItems.sortOrder));
    if (!rows.length) return editorialFinds;
    const images = await db.select().from(findItemImages).orderBy(asc(findItemImages.sortOrder));
    return rows.map((row) => ({ ...row, status: row.status as FindItem['status'], sizes: row.sizes ?? undefined, images: images.filter((image) => image.findItemId === row.id).map((image) => image.url), createdAt: row.createdAt, published: row.published })) as FindItem[];
  } catch { return editorialFinds; }
}

export async function getPublishedReviews(): Promise<ReviewEntry[]> {
  try {
    const rows = await getDb().select().from(reviews).where(eq(reviews.published, true)).orderBy(asc(reviews.sortOrder));
    if (!rows.length) return editorialReviews;
    return rows.map((row) => ({ id: row.id, image: row.imageUrl ?? '', text: row.text, customerName: row.customerName ?? undefined, date: row.date ?? undefined, type: row.type as ReviewEntry['type'], published: row.published, sortOrder: row.sortOrder }));
  } catch { return editorialReviews; }
}
