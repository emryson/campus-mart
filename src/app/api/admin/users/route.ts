import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserFromSession, listUsersForAdmin } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const user = getUserFromSession(cookieStore.get('campus_mart_session')?.value);

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  return NextResponse.json({ users: listUsersForAdmin() });
}
