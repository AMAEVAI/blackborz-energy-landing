import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: body.name,
      company: body.company,
      email: body.email || '',
      phone: body.phone || '',
      status: body.status || 'new',
      source: body.source || 'other',
      priority: body.priority || 'medium',
      value: body.value || 0,
      notes: body.notes || '',
      tags: body.tags || [],
      region: body.region || '',
      contact_person: body.contactPerson || body.name,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
