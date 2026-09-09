import { env } from 'cloudflare:workers';
import { adminErrorResponse, requireAdmin } from '@/lib/admin';

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const file = form.get('file');
    const folder = String(form.get('folder') ?? 'finds').replace(/[^a-z-]/g, '');
    if (!(file instanceof File) || !file.size) return Response.json({ error: 'Выберите файл' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return Response.json({ error: 'Файл должен быть JPG, PNG или WebP до 10 МБ' }, { status: 400 });
    const key = `${folder}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    await env.FILES.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
    return Response.json({ url: `/api/files/${key}` }, { status: 201 });
  } catch (error) { return adminErrorResponse(error); }
}
