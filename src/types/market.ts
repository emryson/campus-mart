export type UniversityId = string;

export interface University {
  id: UniversityId;
  name: string;
  shortName: string;
  city: string;
  popularHostels: string[];
}

export type ItemCategory = 
  | 'all'
  | 'electronics'
  | 'appliances'
  | 'books'
  | 'fashion'
  | 'phones'
  | 'furniture'
  | 'sports'
  | 'groceries'
  | 'services';

export type ItemCondition = 'brand-new' | 'like-new' | 'good' | 'fair';

export interface SellerInfo {
  name: string;
  phone: string; // e.g. "0241234567"
  whatsappNumber: string; // e.g. "233241234567"
  university: string;
  hostelOrHall: string;
  roomOrSpot?: string;
  studentIdVerified?: boolean;
  avatarUrl?: string;
  joinedDate?: string;
}

export interface CampusItem {
  id: string;
  title: string;
  category: ItemCategory;
  price: number; // in Ghanaian Cedis (GH₵)
  isNegotiable: boolean;
  universityId: UniversityId;
  universityName: string;
  location: string; // e.g. "Pentagon Hall, Block B" or "Brunei Complex"
  meetupSpot?: string; // e.g. "Balme Library front" or "Great Hall stairs"
  description: string; // maximum 300 words
  wordCount: number;
  condition: ItemCondition;
  images: string[]; // maximum 5 photos
  seller: SellerInfo;
  createdAt: string; // ISO string
  isSold?: boolean;
  views?: number;
  featured?: boolean;
  isCustomUserPost?: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: ItemCategory;
  universityId: UniversityId;
  locationQuery: string;
  minPrice: number | '';
  maxPrice: number | '';
  negotiableOnly: boolean;
  condition: ItemCondition | 'all';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}
