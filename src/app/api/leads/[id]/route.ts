import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const body = await req.json();

  const dbUpdate: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status !== undefined) dbUpdate.status = body.status;
  if (body.aiScore !== undefined) dbUpdate.ai_score = body.aiScore;
  if (body.aiAnalysis !== undefined) dbUpdate.ai_analysis = body.aiAnalysis;
  if (body.aiSummary !== undefined) dbUpdate.ai_summary = body.aiSummary;
  if (body.notes !== undefined) dbUpdate.notes = body.notes;
  if (body.priority !== undefined) dbUpdate.priority = body.priority;
  if (body.value !== undefined) dbUpdate.value = body.value;

  const { data, error } = await supabase
    .from('leads')
    .update(dbUpdate)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
