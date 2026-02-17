import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCollection } from '@/hooks/api/useCollections';
import { useProducts } from '@/hooks/api/useProducts';
import { Package } from 'lucide-react';

const CollectionPage: React.FC = () => {
    const { handle: slug } = useParams<{ handle: string }>();
    
    // Fetch collection data
    const { data: collection, isLoading: isLoadingCollection } = useCollection(slug || '');
    
    // Fetch products for this collection
    const { data: productsData, isLoading: isLoadingProducts } = useProducts({
      category: collection?.name,
    }, {
      enabled: !!collection?.name,
    });

    if (isLoadingCollection) {
        return <LoadingPage message="Loading collection..." />;
    }

    if (!collection) {
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-text-main mb-4">Collection not found</h2>
            <p className="text-text-secondary mb-6">
              Sorry, we couldn't find the collection you're looking for.
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
    
    const collectionProducts = productsData?.products || [];
    const isLoading = isLoadingProducts;

    return (
        <main className="flex-grow flex flex-col items-center w-full">
            <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col gap-8">
                 {/* Breadcrumbs & Heading */}
                <div className="pt-8">
                    <div className="flex gap-2 text-sm mb-4 text-text-subtle">
                        <Link to="/" className="hover:underline hover:text-primary">Home</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:underline hover:text-primary">Shop</Link>
                        <span>/</span>
                        <span className="text-text-main font-medium">{collection.name}</span>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="relative w-full rounded-xl overflow-hidden group shadow-sm">
                    <div 
                        className="bg-cover bg-center min-h-[320px] md:min-h-[400px] flex items-end relative" 
                        style={{backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%), url("${collection.imageUrl || 'https://picsum.photos/1200/400'}")`}}>
                        <div className="relative z-10 p-8 md:p-12 max-w-3xl">
                            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight font-serif mb-4">{collection.name}</h1>
                            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                                {collection.description || 'Discover our curated collection of handcrafted brass items.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Controls & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-[#f4f3f0]">
                    <div className="text-text-subtle text-sm font-medium">
                        {isLoading ? 'Loading...' : `Showing ${collectionProducts.length} product${collectionProducts.length !== 1 ? 's' : ''}`}
                    </div>
                </div>

                {/* Product Grid */}
                {isLoading ? (
                  <div className="py-12 flex justify-center">
                    <div className="text-center">
                      <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="mt-4 text-text-secondary">Loading products...</p>
                    </div>
                  </div>
                ) : collectionProducts.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No products in this collection"
                    description="Check back soon for new items in this collection."
                    action={{
                      label: 'Browse All Products',
                      onClick: () => window.location.href = '/shop'
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-12">
                      {collectionProducts.map(p => (
                          <ProductCard key={p._id} product={p} />
                      ))}
                  </div>
                )}
            </div>
        </main>
    );
};

export default CollectionPage;
