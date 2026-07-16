export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We use direct supabase client to avoid cookie dependencies in a simple route
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_SETTINGS = {
  address: "ЦУМ-1 (Старый ЦУМ), 1 этаж, отдел H-10",
  phone: "+996 500 000 000",
  workingHours: "Ежедневно с 10:00 до 20:00",
  email: "info@moba.kg",
  instagramUrl: "https://instagram.com/moba.kg",
  whatsappUrl: "https://wa.me/996500000000"
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      // Fallback to default if table doesn't exist yet or is empty
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    return NextResponse.json({
      address: data.address,
      phone: data.phone,
      workingHours: data.working_hours,
      email: data.email,
      instagramUrl: data.instagram_url,
      whatsappUrl: data.whatsapp_url
    });
  } catch (error) {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        address: body.address,
        phone: body.phone,
        working_hours: body.workingHours,
        email: body.email,
        instagram_url: body.instagramUrl,
        whatsapp_url: body.whatsappUrl
      });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: "Supabase save error", details: error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
