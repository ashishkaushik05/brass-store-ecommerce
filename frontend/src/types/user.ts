/**
 * User Types
 * Integrates with Clerk authentication
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  imageUrl?: string;
  role?: 'user' | 'admin';
  createdAt: string;
}

export interface UserProfile extends User {
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}
