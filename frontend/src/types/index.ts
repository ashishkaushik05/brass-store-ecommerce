
export interface Product {
  id: string;
  handle: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  tag?: 'Best Seller' | 'New' | 'Sold Out' | 'Limited' | 'Handcrafted';
  images?: string[];
  finish?: 'Antique' | 'Polished' | 'Black Oxide';
  usage?: 'Puja' | 'Kitchen' | 'Decor' | 'Gifting';
  dimensions?: string;
  weight?: string;
}

export interface Collection {
  id: string;
  handle: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
}

export interface Article {
    id: string;
    slug: string;
    category: string;
    date: string;
    readTime: number;
    title: string;
    excerpt: string;
    imageUrl: string;
    content: string;
}
