
export enum MembershipType {
  FREE = 'FREE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface UserProfile {
  name: string;
  email: string;
  photoURL: string;
  membership: MembershipType;
  expiryDate: string | null;
}

export interface Voice {
  id: string;
  name: string;
  category: 'Free' | 'Premium' | 'Ultra';
  previewUrl: string;
  isDownloaded: boolean;
  avatar: string;
}
