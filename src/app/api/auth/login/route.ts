import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { authenticateUser, createSession, logActivity, sessionCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schoolId = typeof body.schoolId === 'string' ? body.schoolId.trim() : '';
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!schoolId || !username || !password) {
      return NextResponse.json({ error: 'School ID, username, and password are required.' }, { status: 400 });
    }

    const user = authenticateUser(schoolId, username, password);
    if (!user) {
      logActivity(null, 'login_failed', { schoolId, username });
      return NextResponse.json({ error: 'Invalid school ID, username, or password.' }, { status: 401 });
    }

    const session = createSession(user.id);
    logActivity(user.id, 'login', { universityId: user.universityId });

    const response = NextResponse.json({ user });
    response.cookies.set('campus_mart_session', session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to sign in right now.' }, { status: 500 });
  }
}
