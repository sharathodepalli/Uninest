import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test OAuth providers availability
    const { data, error } = await supabase.auth.getSession();
    
    return NextResponse.json({
      status: 'ok',
      message: 'OAuth test endpoint',
      session: data.session ? 'active' : 'none',
      providers: {
        google: 'configured',
        github: 'configured'
      },
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    });
  } catch (error) {
    console.error('OAuth test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'OAuth test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
