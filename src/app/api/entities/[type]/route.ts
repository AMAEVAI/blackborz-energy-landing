import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getEntityConfig } from '@/lib/entities';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const config = getEntityConfig(type);
  if (!config) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from(config.table)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const config = getEntityConfig(type);
  if (!config) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const body = await req.json();
  const row: Record<string, unknown> = { user_id: user.id };
  for (const field of config.fields) {
    const v = body[field.key];
    if (field.type === 'number') row[field.key] = Number(v) || 0;
    else row[field.key] = v ?? '';
  }

  const admin = createAdminClient();
  const { data, error } = await admin.from(config.table).insert([row]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
