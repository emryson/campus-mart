import { NextResponse } from 'next/server';
import { createUser, logActivity, sessionCookieOptions, createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requiredFields = [
      'schoolId',
      'username',
      'password',
      'name',
      'email',
      'phone',
      'universityId',
      'universityName',
      'hostelOrHall',
    ];

    if (requiredFields.some((field) => typeof body[field] !== 'string' || !body[field].trim())) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }

    if (body.password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const user = createUser({
      schoolId: body.schoolId.trim(),
      username: body.username.trim(),
      password: body.password,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      universityId: body.universityId,
      universityName: body.universityName,
      hostelOrHall: body.hostelOrHall.trim(),
      studentId: typeof body.studentId === 'string' ? body.studentId.trim() : undefined,
      avatarUrl: typeof body.avatarUrl === 'string' ? body.avatarUrl.trim() : undefined,
    });

    const session = createSession(user.id);
    logActivity(user.id, 'signup', { universityId: user.universityId });

    const response = NextResponse.json({ user }, { status: 201 });
    response.cookies.set('campus_mart_session', session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch (error) {
    const isDuplicate = error instanceof Error && error.message.includes('UNIQUE constraint failed');
    return NextResponse.json(
      { error: isDuplicate ? 'That school ID and username combination is already registered.' : 'Unable to create account.' },
      { status: isDuplicate ? 409 : 500 },
    );
  }
}
