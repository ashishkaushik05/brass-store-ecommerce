
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { products, collections } from '@/data/mockData';

const CollectionPage: React.FC = () => {
    const { handle } = useParams<{ handle: string }>();
    const collection = collections.find(c => c.handle === handle);
    
    // In a real app, you'd fetch products for this collection. Here we simulate.
    const collectionProducts = products.slice(0, 8);

    if (!collection) {
        return <div className="text-center py-20">Collection not found.</div>;
    }

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
                        style={{backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%), url("${collection.imageUrl}")`}}>
                        <div className="relative z-10 p-8 md:p-12 max-w-3xl">
                            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight font-serif mb-4">{collection.name}</h1>
                            <p className="text-white/90 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                                {collection.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Controls & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-b border-[#f4f3f0]">
                    <div className="text-text-subtle text-sm font-medium">
                        Showing {collectionProducts.length} of {collectionProducts.length} products
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-12">
                    {collectionProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default CollectionPage;
