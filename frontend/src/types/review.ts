/**
 * Review Types
 * Matches backend Review model
 */

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  helpfulBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  content: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  content?: string;
}

export interface ReviewFilters {
  productId?: string;
  userId?: string;
  rating?: number;
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  };
}
