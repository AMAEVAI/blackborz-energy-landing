import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const body = await req.json();

  const dbUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status !== undefined) dbUpdate.status = body.status;
  if (body.aiScore !== undefined) dbUpdate.ai_score = body.aiScore;
  if (body.aiAnalysis !== undefined) dbUpdate.ai_analysis = body.aiAnalysis;
  if (body.aiSummary !== undefined) dbUpdate.ai_summary = body.aiSummary;
  if (body.notes !== undefined) dbUpdate.notes = body.notes;
  if (body.priority !== undefined) dbUpdate.priority = body.priority;
  if (body.value !== undefined) dbUpdate.value = body.value;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('leads')
    .update(dbUpdate)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin.from('leads').delete().eq('id', id).eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
