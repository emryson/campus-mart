import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { StudentUser } from '@/types/market';

const databaseDirectory = path.join(process.cwd(), 'data');
const databasePath = process.env.DATABASE_PATH || path.join(databaseDirectory, 'campus-mart.db');

if (!process.env.DATABASE_PATH) {
  fs.mkdirSync(databaseDirectory, { recursive: true });
}

type UserRow = {
  id: string;
  role: 'student' | 'admin';
  school_id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  university_id: string;
  university_name: string;
  hostel_or_hall: string;
  student_id: string | null;
  avatar_url: string | null;
  is_verified: number;
  created_at: string;
};

type SessionRow = {
  user_id: string;
  expires_at: string;
};

declare global {
  // eslint-disable-next-line no-var
  var campusMartDatabase: Database.Database | undefined;
}

const database = globalThis.campusMartDatabase || new Database(databasePath);

globalThis.campusMartDatabase = database;
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'student',
    school_id TEXT NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    university_id TEXT NOT NULL,
    university_name TEXT NOT NULL,
    hostel_or_hall TEXT NOT NULL,
    student_id TEXT,
    avatar_url TEXT,
    is_verified INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    UNIQUE (school_id, username)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
  CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at);
`);

try {
  database.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'");
} catch {
  // Existing databases already have the role column.
}

const toStudentUser = (row: UserRow): StudentUser => ({
  id: row.id,
  role: row.role,
  schoolId: row.school_id,
  username: row.username,
  name: row.name,
  email: row.email,
  phone: row.phone,
  universityId: row.university_id,
  universityName: row.university_name,
  hostelOrHall: row.hostel_or_hall,
  studentId: row.student_id || undefined,
  avatarUrl: row.avatar_url || undefined,
  isVerified: Boolean(row.is_verified),
  createdAt: row.created_at,
});

const getUserById = (id: string) => {
  return database.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
};

export const createUser = (input: {
  schoolId: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  universityId: string;
  universityName: string;
  hostelOrHall: string;
  studentId?: string;
  avatarUrl?: string;
  role?: 'student' | 'admin';
}) => {
  const userId = `user-${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(input.password, 12);

  database.prepare(`
    INSERT INTO users (
      id, role, school_id, username, password_hash, name, email, phone,
      university_id, university_name, hostel_or_hall, student_id, avatar_url,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    input.role || 'student',
    input.schoolId,
    input.username,
    passwordHash,
    input.name,
    input.email,
    input.phone,
    input.universityId,
    input.universityName,
    input.hostelOrHall,
    input.studentId || null,
    input.avatarUrl || null,
    createdAt,
  );

  const user = getUserById(userId);
  if (!user) throw new Error('Unable to create user');
  return toStudentUser(user);
};

export const authenticateUser = (schoolId: string, username: string, password: string) => {
  const row = database.prepare(
    'SELECT * FROM users WHERE lower(school_id) = lower(?) AND lower(username) = lower(?)',
  ).get(schoolId, username) as (UserRow & { password_hash: string }) | undefined;

  if (!row || !bcrypt.compareSync(password, row.password_hash)) return null;
  return toStudentUser(row);
};

export const authenticateAdmin = (username: string, password: string) => {
  const adminSchoolId = process.env.ADMIN_SCHOOL_ID;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminSchoolId || !adminUsername || !adminPassword) return null;
  if (username !== adminUsername || password !== adminPassword) return null;

  const existing = database.prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1").get() as UserRow | undefined;
  if (existing) return toStudentUser(existing);

  return createUser({
    schoolId: adminSchoolId,
    username: adminUsername,
    password: adminPassword,
    name: 'CampusMart Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@campusmart.local',
    phone: process.env.ADMIN_PHONE || '',
    universityId: 'all',
    universityName: 'CampusMart Administration',
    hostelOrHall: 'Administration',
    role: 'admin',
  });
};

export const createSession = (userId: string) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

  database.prepare(
    'INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)',
  ).run(token, userId, expiresAt, new Date().toISOString());

  return { token, expiresAt };
};

export const getUserFromSession = (token: string | undefined) => {
  if (!token) return null;

  const row = database.prepare(`
    SELECT s.user_id, s.expires_at
    FROM sessions s
    WHERE s.token = ?
  `).get(token) as SessionRow | undefined;

  if (!row || new Date(row.expires_at).getTime() <= Date.now()) {
    if (row) database.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    return null;
  }

  const user = getUserById(row.user_id);
  return user ? toStudentUser(user) : null;
};

export const listUsersForAdmin = () => {
  return database.prepare(`
    SELECT
      u.id,
      u.role,
      u.school_id AS schoolId,
      u.username,
      u.name,
      u.email,
      u.phone,
      u.university_name AS universityName,
      u.hostel_or_hall AS hostelOrHall,
      u.avatar_url AS avatarUrl,
      u.is_verified AS isVerified,
      u.created_at AS createdAt,
      COUNT(a.id) AS activityCount
    FROM users u
    LEFT JOIN activities a ON a.user_id = u.id
    GROUP BY u.id
    ORDER BY datetime(u.created_at) DESC
  `).all() as Array<{
    id: string;
    role: 'student' | 'admin';
    schoolId: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    universityName: string;
    hostelOrHall: string;
    avatarUrl: string | null;
    isVerified: number;
    createdAt: string;
    activityCount: number;
  }>;
};

export const deleteSession = (token: string | undefined) => {
  if (token) database.prepare('DELETE FROM sessions WHERE token = ?').run(token);
};

export const logActivity = (
  userId: string | null,
  activityType: string,
  metadata: Record<string, unknown> = {},
) => {
  database.prepare(
    'INSERT INTO activities (id, user_id, activity_type, metadata, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(
    `activity-${crypto.randomUUID()}`,
    userId,
    activityType,
    JSON.stringify(metadata),
    new Date().toISOString(),
  );
};

export const sessionCookieOptions = (expiresAt: string) => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  expires: new Date(expiresAt),
  path: '/',
});

export const clearSessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 0,
  path: '/',
};
