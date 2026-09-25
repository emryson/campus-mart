import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserFromSession, logActivity } from '@/lib/auth';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const user = getUserFromSession(cookieStore.get('campus_mart_session')?.value);

  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Only an admin can moderate listings.' }, { status: 403 });
  }

  const { id } = await params;
  logActivity(user.id, 'admin_listing_deleted', { itemId: id });
  return NextResponse.json({ success: true });
}
