import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '@/components/Icon';
import Section from '@/components/Section';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { useProduct, useProducts } from '@/hooks/api/useProducts';
import { useProductReviews } from '@/hooks/api/useReviews';
import { useAddToCart } from '@/hooks/api/useCart';
import { toast } from 'sonner';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#e6e2db]">
      <button 
        className="w-full flex justify-between items-center py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-text-main">{title}</span>
        <Icon name={isOpen ? 'remove' : 'add'} className="text-lg text-primary" />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen py-4' : 'max-h-0'}`}>
        <div className="prose prose-sm text-text-subtle max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductPage: React.FC = () => {
    const { handle: slug } = useParams<{ handle: string }>();
    const [quantity, setQuantity] = useState(1);
    
    // Fetch product data
    const { data: product, isLoading, error } = useProduct(slug || '');
    
    // Fetch product reviews
    const { data: reviewsData } = useProductReviews(slug || '');
    
    // Fetch related products (same category)
    const { data: relatedData } = useProducts({
      category: product?.category,
      limit: 4,
    }, {
      enabled: !!product?.category,
    });
    
    // Add to cart mutation
    const addToCart = useAddToCart();
    
    const [mainImage, setMainImage] = useState('');

    React.useEffect(() => {
        if (product?.images?.[0]) {
            setMainImage(product.images[0]);
            setQuantity(1);
        }
    }, [product]);

    const handleAddToCart = () => {
      if (!product) return;
      
      addToCart.mutate({
        productId: product._id,
        quantity,
      });
    };

    if (isLoading) {
        return <LoadingPage message="Loading product..." />;
    }

    if (error || !product) {
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-text-main mb-4">Product not found</h2>
            <p className="text-text-secondary mb-6">
              Sorry, we couldn't find the product you're looking for.
            </p>
            <Link 
              to="/shop" 
              className="inline-block px-6 py-3 bg-primary text-text-main font-bold rounded hover:bg-opacity-90 transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        );
    }

    const relatedProducts = (relatedData?.products || []).filter(p => p._id !== product._id).slice(0, 4);
    const reviews = reviewsData?.reviews || [];

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10">
            {/* Breadcrumbs */}
            <nav className="flex flex-wrap gap-2 py-4 my-6 text-sm">
              <Link to="/" className="text-text-subtle font-medium hover:text-primary">Home</Link>
              <span className="text-text-subtle font-medium">/</span>
              <Link to="/shop" className="text-text-subtle font-medium hover:text-primary">Shop</Link>
              <span className="text-text-subtle font-medium">/</span>
              <span className="text-text-main font-medium">{product.name}</span>
            </nav>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
                {/* Left: Gallery */}
                <div className="flex flex-col gap-4 sticky top-24 h-max">
                    <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-[#f4f3f0] relative group">
                        <img src={mainImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {/* Wishlist Button */}
                        <div className="absolute top-4 right-4 z-10">
                          <WishlistButton productId={product._id} size="md" />
                        </div>
                    </div>
                    {product.images && product.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-4">
                          {product.images.slice(0, 4).map((img, idx) => (
                              <button key={idx} onClick={() => setMainImage(img)} className={`aspect-square rounded-lg overflow-hidden border-2 ${mainImage === img ? 'border-primary' : 'border-transparent'} hover:border-text-subtle cursor-pointer`}>
                                  <img src={img} alt={`${product.name} thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                              </button>
                          ))}
                      </div>
                    )}
                </div>

                {/* Right: Info Panel */}
                <div className="flex flex-col h-full">
                    <div className="pb-6 border-b border-[#e6e2db]">
                        <h1 className="text-text-main text-3xl md:text-4xl font-bold font-serif leading-tight mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <p className="text-2xl font-medium text-text-main">₹{product.price.toLocaleString()}</p>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <p className="text-lg text-text-secondary line-through">₹{product.compareAtPrice.toLocaleString()}</p>
                            )}
                            {product.averageRating && product.reviewCount ? (
                              <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Icon 
                                      key={i} 
                                      name="star" 
                                      className="text-primary text-[18px]" 
                                      style={{fontVariationSettings: i < Math.round(product.averageRating!) ? "'FILL' 1" : "'FILL' 0"}}
                                    />
                                  ))}
                                  <span className="text-sm text-text-subtle ml-1 underline cursor-pointer hover:text-primary">
                                    ({product.reviewCount} {product.reviewCount === 1 ? 'Review' : 'Reviews'})
                                  </span>
                              </div>
                            ) : null}
                        </div>
                        <p className="text-[#4a453e] text-base leading-relaxed">
                            {product.description || 'Hand-beaten by master artisans, this piece captures golden hour light in its textured finish, bringing timeless elegance to your modern home.'}
                        </p>
                    </div>

                    <div className="py-6 flex flex-col gap-6">
                        {product.stock > 0 ? (
                          <div className="flex gap-4 items-end">
                              <div className="flex flex-col gap-2">
                                  <label className="text-sm font-bold text-text-main uppercase tracking-wider">Quantity</label>
                                  <div className="flex items-center h-12 border border-[#e6e2db] rounded-lg w-32 bg-white">
                                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 h-full flex items-center justify-center text-xl text-text-subtle hover:text-text-main transition-colors">-</button>
                                      <span className="flex-1 text-center font-medium text-text-main">{quantity}</span>
                                      <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="flex-1 h-full flex items-center justify-center text-xl text-text-subtle hover:text-text-main transition-colors">+</button>
                                  </div>
                              </div>
                              <button 
                                onClick={handleAddToCart}
                                disabled={addToCart.isPending}
                                className="flex-1 h-12 bg-primary hover:bg-opacity-90 text-text-main font-bold rounded-lg uppercase tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                  <Icon name="shopping_bag" className="text-[20px]" />
                                  {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                              </button>
                          </div>
                        ) : (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 font-medium">Out of Stock</p>
                            <p className="text-red-600 text-sm mt-1">This item is currently unavailable.</p>
                          </div>
                        )}
                        {product.stock > 0 && product.stock <= 10 && (
                          <p className="text-sm text-orange-600 font-medium">
                            Only {product.stock} left in stock!
                          </p>
                        )}
                    </div>
                    
                    <div className="py-6">
                        <AccordionItem title="Material & Finish">
                            <p><strong>Material:</strong> 100% Pure Brass (Pital)</p>
                            <p><strong>Finish:</strong> {product.metadata?.finish || 'Polished'}. Each piece is hand-finished, leading to unique variations that are a hallmark of artisanal craftsmanship.</p>
                        </AccordionItem>
                        <AccordionItem title="Dimensions & Weight">
                             <p>{product.metadata?.dimensions || 'Dimensions not available'}</p>
                             <p>{product.metadata?.weight ? `Weight: ${product.metadata.weight}` : 'Weight not available'}</p>
                             <p>As each item is handcrafted, please allow for slight variations in size and weight.</p>
                        </AccordionItem>
                        <AccordionItem title="Care Instructions">
                            <p>Gently wipe with a soft, dry cloth. Avoid harsh chemicals and abrasive materials. For a natural polish, use a mixture of lemon juice and baking soda. <Link to="/policies/care" className="text-primary underline">View full care guide</Link>.</p>
                        </AccordionItem>
                        <AccordionItem title="Shipping & Returns">
                            <p>Free shipping on all orders across India. Estimated delivery within 5-7 business days. For returns, please refer to our <Link to="/policies/returns" className="text-primary underline">Return Policy</Link>.</p>
                        </AccordionItem>
                    </div>
                </div>
            </div>

            <ReviewSection reviews={reviews} />

            {/* You Might Also Like */}
            {relatedProducts.length > 0 && (
              <Section py="py-20 md:py-24">
                  <h3 className="text-2xl font-bold font-serif text-text-main mb-8 text-center">You Might Also Like</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {relatedProducts.map(p => (
                          <ProductCard key={p._id} product={p} />
                      ))}
                  </div>
              </Section>
            )}
        </div>
    );
};

export default ProductPage;