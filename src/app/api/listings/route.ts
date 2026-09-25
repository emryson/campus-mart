import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createListingRecord, getUserFromSession, listListings, logActivity, normalizeListingInput } from '@/lib/auth';

export async function GET() {
  return NextResponse.json({ listings: listListings() });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const user = getUserFromSession(cookieStore.get('campus_mart_session')?.value);

  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const normalized = normalizeListingInput(body);

    if (!normalized.title) {
      return NextResponse.json({ error: 'Please enter a title.' }, { status: 400 });
    }

    if (!normalized.location) {
      return NextResponse.json({ error: 'Please provide the campus location.' }, { status: 400 });
    }

    if (!normalized.description) {
      return NextResponse.json({ error: 'Please provide a description.' }, { status: 400 });
    }

    if (normalized.price <= 0) {
      return NextResponse.json({ error: 'Please enter a valid price.' }, { status: 400 });
    }

    if (normalized.images.length === 0) {
      return NextResponse.json({ error: 'Please add at least one photo.' }, { status: 400 });
    }

    const listing = createListingRecord(user.id, normalized);
    logActivity(user.id, 'listing_created', { listingId: listing.id, category: listing.category });

    return NextResponse.json({ listing }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to create listing right now.' }, { status: 500 });
  }
}
