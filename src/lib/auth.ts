import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { INITIAL_CAMPUS_ITEMS } from '@/data/mockItems';
import { listingToCampusItem, normalizeListingInput, type NormalizedListingInput } from '@/lib/listings';
import type { CampusItem, StudentUser } from '@/types/market';

export { normalizeListingInput } from '@/lib/listings';

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

type ListingRow = {
  id: string;
  title: string;
  category: string;
  price: number;
  is_negotiable: number;
  university_id: string;
  university_name: string;
  location: string;
  meetup_spot: string | null;
  description: string;
  word_count: number;
  condition: string;
  images: string | null;
  seller_name: string;
  seller_phone: string;
  seller_whatsapp_number: string;
  seller_university: string;
  seller_hostel_or_hall: string;
  seller_room_or_spot: string | null;
  seller_student_id_verified: number;
  seller_avatar_url: string | null;
  created_at: string;
  is_sold: number;
  views: number;
  featured: number;
  is_custom_user_post: number;
  owner_id: string | null;
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

  CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    is_negotiable INTEGER NOT NULL DEFAULT 0,
    university_id TEXT NOT NULL,
    university_name TEXT NOT NULL,
    location TEXT NOT NULL,
    meetup_spot TEXT,
    description TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0,
    condition TEXT NOT NULL,
    images TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    seller_phone TEXT NOT NULL,
    seller_whatsapp_number TEXT NOT NULL,
    seller_university TEXT NOT NULL,
    seller_hostel_or_hall TEXT NOT NULL,
    seller_room_or_spot TEXT,
    seller_student_id_verified INTEGER NOT NULL DEFAULT 0,
    seller_avatar_url TEXT,
    created_at TEXT NOT NULL,
    is_sold INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    is_custom_user_post INTEGER NOT NULL DEFAULT 0,
    owner_id TEXT REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS activities_user_id_idx ON activities(user_id);
  CREATE INDEX IF NOT EXISTS activities_created_at_idx ON activities(created_at);
  CREATE INDEX IF NOT EXISTS listings_owner_id_idx ON listings(owner_id);
  CREATE INDEX IF NOT EXISTS listings_university_id_idx ON listings(university_id);
  CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings(created_at);
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

const seedDefaultListings = () => {
  const listingCount = database.prepare('SELECT COUNT(*) AS count FROM listings').get() as { count: number };
  if (listingCount.count > 0) return;

  for (const item of INITIAL_CAMPUS_ITEMS) {
    database.prepare(`
      INSERT INTO listings (
        id, title, category, price, is_negotiable, university_id, university_name,
        location, meetup_spot, description, word_count, condition, images,
        seller_name, seller_phone, seller_whatsapp_number, seller_university,
        seller_hostel_or_hall, seller_room_or_spot, seller_student_id_verified,
        seller_avatar_url, created_at, is_sold, views, featured,
        is_custom_user_post, owner_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      item.id,
      item.title,
      item.category,
      item.price,
      item.isNegotiable ? 1 : 0,
      item.universityId,
      item.universityName,
      item.location,
      item.meetupSpot || null,
      item.description,
      item.wordCount ?? item.description.split(/\s+/).filter(Boolean).length,
      item.condition,
      JSON.stringify(item.images),
      item.seller.name,
      item.seller.phone,
      item.seller.whatsappNumber,
      item.seller.university,
      item.seller.hostelOrHall,
      item.seller.roomOrSpot || null,
      item.seller.studentIdVerified ? 1 : 0,
      item.seller.avatarUrl || null,
      item.createdAt,
      item.isSold ? 1 : 0,
      item.views ?? 0,
      item.featured ? 1 : 0,
      item.isCustomUserPost ? 1 : 0,
      item.ownerId || null,
    );
  }
};

export const listListings = (): CampusItem[] => {
  seedDefaultListings();

  const rows = database.prepare('SELECT * FROM listings ORDER BY datetime(created_at) DESC').all() as ListingRow[];
  return rows.map((row) => listingToCampusItem(row));
};

export const createListingRecord = (ownerUserId: string, input: NormalizedListingInput): CampusItem => {
  const listingId = `item-${crypto.randomUUID()}`;
  const createdAt = new Date().toISOString();
  const listing: CampusItem = {
    id: listingId,
    title: input.title,
    category: input.category,
    price: input.price,
    isNegotiable: input.isNegotiable,
    universityId: input.universityId,
    universityName: input.universityName,
    location: input.location,
    meetupSpot: input.meetupSpot || undefined,
    description: input.description,
    wordCount: input.wordCount,
    condition: input.condition,
    images: input.images,
    seller: input.seller,
    createdAt,
    isSold: false,
    views: 1,
    featured: false,
    isCustomUserPost: true,
    ownerId: ownerUserId,
  };

  database.prepare(`
    INSERT INTO listings (
      id, title, category, price, is_negotiable, university_id, university_name,
      location, meetup_spot, description, word_count, condition, images,
      seller_name, seller_phone, seller_whatsapp_number, seller_university,
      seller_hostel_or_hall, seller_room_or_spot, seller_student_id_verified,
      seller_avatar_url, created_at, is_sold, views, featured,
      is_custom_user_post, owner_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    listing.id,
    listing.title,
    listing.category,
    listing.price,
    listing.isNegotiable ? 1 : 0,
    listing.universityId,
    listing.universityName,
    listing.location,
    listing.meetupSpot || null,
    listing.description,
    listing.wordCount,
    listing.condition,
    JSON.stringify(listing.images),
    listing.seller.name,
    listing.seller.phone,
    listing.seller.whatsappNumber,
    listing.seller.university,
    listing.seller.hostelOrHall,
    listing.seller.roomOrSpot || null,
    listing.seller.studentIdVerified ? 1 : 0,
    listing.seller.avatarUrl || null,
    listing.createdAt,
    listing.isSold ? 1 : 0,
    listing.views ?? 0,
    listing.featured ? 1 : 0,
    listing.isCustomUserPost ? 1 : 0,
    listing.ownerId || null,
  );

  return listing;
};

export const deleteListingRecord = (listingId: string) => {
  const result = database.prepare('DELETE FROM listings WHERE id = ?').run(listingId);
  return result.changes > 0;
};

export const getListingById = (listingId: string): CampusItem | undefined => {
  const row = database.prepare('SELECT * FROM listings WHERE id = ?').get(listingId) as ListingRow | undefined;
  return row ? listingToCampusItem(row) : undefined;
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
