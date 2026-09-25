import { NextResponse } from 'next/server';
import { authenticateAdmin, createSession, logActivity, sessionCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json({ error: 'Admin username and password are required.' }, { status: 400 });
    }

    const user = authenticateAdmin(username, password);
    if (!user) {
      logActivity(null, 'admin_login_failed', { username });
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const session = createSession(user.id);
    logActivity(user.id, 'admin_login');
    const response = NextResponse.json({ user });
    response.cookies.set('campus_mart_session', session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to sign in as admin.' }, { status: 500 });
  }
}
