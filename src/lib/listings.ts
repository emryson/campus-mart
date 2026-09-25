import type { CampusItem, ItemCategory, ItemCondition, SellerInfo } from '@/types/market';

export type NormalizedListingInput = {
  title: string;
  category: ItemCategory;
  price: number;
  isNegotiable: boolean;
  universityId: string;
  universityName: string;
  location: string;
  meetupSpot?: string;
  description: string;
  wordCount: number;
  condition: ItemCondition;
  images: string[];
  seller: SellerInfo;
};

const readString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).trim();
  return fallback;
};

const readBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return Boolean(value);
};

const readNumber = (value: unknown): number => {
  const parsed = typeof value === 'number' ? value : Number(String(value ?? '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

export const normalizeListingInput = (input: Record<string, unknown>): NormalizedListingInput => {
  const merchant = input.seller && typeof input.seller === 'object' ? (input.seller as Record<string, unknown>) : {};
  const sellerName = readString(merchant.name ?? input.sellerName, 'Unknown seller');
  const sellerPhone = readString(merchant.phone ?? input.sellerPhone, '');
  const sellerWhatsapp = readString(merchant.whatsappNumber ?? input.sellerWhatsappNumber, sellerPhone.replace(/\D/g, ''));
  const sellerUniversity = readString(merchant.university ?? input.sellerUniversity, 'Campus');
  const sellerHostelOrHall = readString(merchant.hostelOrHall ?? input.sellerHostelOrHall, 'Campus');
  const sellerRoomOrSpot = readString(merchant.roomOrSpot ?? input.sellerRoomOrSpot, '');
  const sellerAvatarUrl = readString(merchant.avatarUrl ?? input.sellerAvatarUrl, '');
  const sellerStudentIdVerified = readBoolean(merchant.studentIdVerified ?? input.sellerStudentIdVerified ?? true);

  const title = readString(input.title, '');
  const description = readString(input.description, '');
  const price = readNumber(input.price);
  const images = Array.isArray(input.images)
    ? (input.images as unknown[])
        .filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
        .slice(0, 5)
    : [];

  const normalisedSeller: SellerInfo = {
    name: sellerName,
    phone: sellerPhone,
    whatsappNumber: sellerWhatsapp,
    university: sellerUniversity,
    hostelOrHall: sellerHostelOrHall,
    roomOrSpot: sellerRoomOrSpot || undefined,
    studentIdVerified: sellerStudentIdVerified,
    avatarUrl: sellerAvatarUrl || undefined,
    joinedDate: readString(merchant.joinedDate, 'Joined recently'),
  };

  const wordCount = description ? description.split(/\s+/).filter(Boolean).length : 0;

  return {
    title: title.replace(/\s+/g, ' '),
    category: (readString(input.category, 'electronics') || 'electronics') as ItemCategory,
    price,
    isNegotiable: readBoolean(input.isNegotiable),
    universityId: readString(input.universityId, 'all'),
    universityName: readString(input.universityName, 'Campus Market'),
    location: readString(input.location, ''),
    meetupSpot: readString(input.meetupSpot, ''),
    description,
    wordCount,
    condition: (readString(input.condition, 'good') || 'good') as ItemCondition,
    images,
    seller: normalisedSeller,
  };
};

export const listingToCampusItem = (listing: {
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
}): CampusItem => {
  const parsedImages = listing.images ? JSON.parse(listing.images) as string[] : [];
  return {
    id: listing.id,
    title: listing.title,
    category: listing.category as ItemCategory,
    price: Number(listing.price),
    isNegotiable: Boolean(listing.is_negotiable),
    universityId: listing.university_id,
    universityName: listing.university_name,
    location: listing.location,
    meetupSpot: listing.meetup_spot || undefined,
    description: listing.description,
    wordCount: Number(listing.word_count),
    condition: listing.condition as ItemCondition,
    images: Array.isArray(parsedImages) ? parsedImages : [],
    seller: {
      name: listing.seller_name,
      phone: listing.seller_phone,
      whatsappNumber: listing.seller_whatsapp_number,
      university: listing.seller_university,
      hostelOrHall: listing.seller_hostel_or_hall,
      roomOrSpot: listing.seller_room_or_spot || undefined,
      studentIdVerified: Boolean(listing.seller_student_id_verified),
      avatarUrl: listing.seller_avatar_url || undefined,
      joinedDate: 'Joined recently',
    },
    createdAt: listing.created_at,
    isSold: Boolean(listing.is_sold),
    views: Number(listing.views) || 0,
    featured: Boolean(listing.featured),
    isCustomUserPost: Boolean(listing.is_custom_user_post),
    ownerId: listing.owner_id || undefined,
  };
};
