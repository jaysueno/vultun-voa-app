import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test the connection
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        { error: 'Supabase connection error', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      config: {
        url: supabaseUrl,
        hasKey: !!supabaseKey,
      },
      session: data
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected error', details: error },
      { status: 500 }
    );
  }
} 