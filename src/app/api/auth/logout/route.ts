import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { deleteSession, getUserFromSession, logActivity, clearSessionCookieOptions } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('campus_mart_session')?.value;
  const user = getUserFromSession(token);

  if (user) logActivity(user.id, 'logout');
  deleteSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.set('campus_mart_session', '', clearSessionCookieOptions);
  return response;
}
