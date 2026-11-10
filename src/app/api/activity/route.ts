import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserFromSession, logActivity } from '@/lib/auth';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const user = getUserFromSession(cookieStore.get('campus_mart_session')?.value);

  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const body = await request.json();
  const activityType = typeof body.type === 'string' ? body.type.trim() : '';
  const allowedTypes = new Set([
    'login',
    'login_failed',
    'logout',
    'signup',
    'listing_created',
    'listing_deleted',
    'admin_listing_deleted',
    'admin_login',
    'admin_login_failed',
    'saved_item_toggled',
  ]);

  if (!activityType || activityType.length > 80 || !allowedTypes.has(activityType)) {
    return NextResponse.json({ error: 'A valid activity type is required.' }, { status: 400 });
  }

  const metadata = typeof body.metadata === 'object' && body.metadata !== null && !Array.isArray(body.metadata)
    ? body.metadata as Record<string, unknown>
    : {};

  logActivity(user.id, activityType, metadata);
  return NextResponse.json({ success: true }, { status: 201 });
}
