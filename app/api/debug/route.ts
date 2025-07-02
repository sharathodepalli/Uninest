import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'NOT_SET',
      runtime: 'Edge' in globalThis ? 'edge' : 'node'
    };

    return NextResponse.json({
      status: 'ok',
      message: 'Diagnostic check completed',
      data: diagnostics
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Diagnostic check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
