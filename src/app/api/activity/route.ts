import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserFromSession, logActivity } from '@/lib/auth';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const user = getUserFromSession(cookieStore.get('campus_mart_session')?.value);

  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const body = await request.json();
  const activityType = typeof body.type === 'string' ? body.type.trim() : '';
  if (!activityType || activityType.length > 80) {
    return NextResponse.json({ error: 'A valid activity type is required.' }, { status: 400 });
  }

  logActivity(user.id, activityType, typeof body.metadata === 'object' ? body.metadata : {});
  return NextResponse.json({ success: true }, { status: 201 });
}
