/**
 * Collection Types
 * Matches backend Collection model
 */

export interface Collection {
  _id: string;
  name: string;
  handle: string;
  description: string;
  imageUrl: string;
  products?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionsResponse {
  collections: Collection[];
}
