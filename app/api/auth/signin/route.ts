import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('SignIn error:', error);
      return NextResponse.json(
        { error: error.message || 'Sign in failed' },
        { status: 400 }
      );
    }

    if (data.user) {
      console.log('User signed in successfully:', data.user.id);
      return NextResponse.json(
        { 
          message: 'Sign in successful',
          user: data.user,
          session: data.session
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Sign in failed' },
      { status: 400 }
    );

  } catch (err) {
    console.error('SignIn API error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
