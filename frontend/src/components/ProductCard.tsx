
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import Icon from './Icon';
import { WishlistButton } from './wishlist/WishlistButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images?.[0] || '';
  const tag = product.tags?.[0];

  return (
    <div className="group relative flex flex-col">
        <div className="relative overflow-hidden rounded-lg aspect-square mb-4 bg-[#f4f3f0]">
          <Link to={`/product/${product.slug}`}>
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-subtle">
                <Icon name="image" className="text-[48px]" />
              </div>
            )}
          </Link>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <WishlistButton productId={product._id} size="md" />
          </div>
          <button className="absolute bottom-4 right-4 w-10 h-10 bg-white text-text-main rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-primary">
            <Icon name="add_shopping_cart" className="text-[20px]" />
          </button>
          {tag && (
            <span className="absolute top-4 left-4 bg-text-main text-white text-xs font-bold px-2 py-1 rounded">
              {tag}
            </span>
          )}
        </div>
      <Link to={`/product/${product.slug}`}>
        <h3 className="text-lg font-serif font-medium text-text-main">{product.name}</h3>
      </Link>
      <div className="flex justify-between items-center mt-1">
        <p className="text-text-subtle">{product.category}</p>
        <p className="font-bold text-text-main">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;
