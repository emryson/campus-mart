import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { deleteListingRecord, getListingById, getUserFromSession, logActivity } from '@/lib/auth';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const user = getUserFromSession(cookieStore.get('campus_mart_session')?.value);

  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
  }

  const isOwner = listing.ownerId === user.id;
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: 'You can only delete your own listing.' }, { status: 403 });
  }

  const deleted = deleteListingRecord(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Unable to delete listing.' }, { status: 500 });
  }

  logActivity(user.id, isAdmin ? 'admin_listing_deleted' : 'listing_deleted', { itemId: id });
  return NextResponse.json({ success: true });
}
