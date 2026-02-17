import React from 'react';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import CollectionCard from '@/components/CollectionCard';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/Icon';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import { useProducts } from '@/hooks/api/useProducts';
import { useCollections } from '@/hooks/api/useCollections';

const HomePage: React.FC = () => {
  // Fetch best sellers (sorted by rating)
  const { data: bestSellersData, isLoading: isLoadingProducts } = useProducts({
    sortBy: '-averageRating',
    limit: 4,
    isActive: true,
  });

  // Fetch collections
  const { data: collectionsData, isLoading: isLoadingCollections } = useCollections();

  const bestSellers = bestSellersData?.products || [];
  const homeCollections = collectionsData?.slice(0, 4) || [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://picsum.photos/id/10/1800/1200')" }}></div>
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 mt-20">
          <h1 className="text-white font-serif text-5xl md:text-7xl font-bold leading-tight tracking-tight drop-shadow-sm">
            Forged in Fire,<br/>Finished by Hand
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-lg leading-relaxed">
            Timeless brass artifacts for the modern home. Handcrafted by master artisans of Jaipur.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="bg-primary hover:bg-[#d69310] text-text-main px-8 py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all transform hover:scale-105 shadow-lg shadow-black/20">
              Shop Collection
            </Link>
            <Link to="/story" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all transform hover:scale-105 hover:bg-white hover:text-text-main">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <Section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Our Categories</span>
            <h2 className="text-text-main font-serif text-4xl font-medium">Curated Collections</h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-2 text-sm font-bold border-b border-primary/50 pb-0.5 hover:text-primary transition-colors">
            View All Categories
            <Icon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {isLoadingCollections ? (
          <LoadingSection />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeCollections.map(collection => (
              <CollectionCard key={collection._id} collection={collection} />
            ))}
          </div>
        )}
      </Section>

      {/* Best Sellers */}
      <Section className="bg-white" py="py-16">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2 block">Customer Favorites</span>
          <h2 className="text-text-main font-serif text-4xl font-medium">Best Sellers</h2>
        </div>
        {isLoadingProducts ? (
          <LoadingSection />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link to="/shop" className="flex items-center gap-2 border border-text-main text-text-main px-8 py-3 rounded-lg font-bold text-sm tracking-wide hover:bg-text-main hover:text-white transition-colors">
                View All Best Sellers
              </Link>
            </div>
          </>
        )}
      </Section>

      {/* Craftsmanship story preview */}
      <Section className="bg-[#f4f3f0]" py="py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="lg:w-1/2 relative group">
            <div className="aspect-[4/5] rounded-lg overflow-hidden relative z-10">
              <img src="https://picsum.photos/id/20/800/1000" alt="Artisan Workshop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary rounded-lg z-0 lg:block hidden"></div>
          </div>
          <div className="lg:w-1/2 flex flex-col gap-8 text-center lg:text-left">
            <div>
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-4 block">The Thathera Tradition</span>
              <h2 className="text-text-main font-serif text-4xl md:text-5xl font-medium leading-tight">
                Preserving a 400-year-old art form rooted in Jaipur.
              </h2>
            </div>
            <div className="flex flex-col gap-4 text-text-main/80 text-lg font-light leading-relaxed">
              <p>
                Every piece at Pitalya tells a story of patience, precision, and passion. Our artisans, descendants of the original Thathera community, forge metal with rhythmic beats that have echoed through generations.
              </p>
            </div>
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link to="/story" className="text-text-main font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors inline-flex items-center gap-2">
                Read Our Full Story
                <Icon name="arrow_right_alt" className="text-[18px]" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Quote Section */}
      <Section className="bg-white" py="py-24">
          <div className="max-w-3xl mx-auto text-center">
              <Icon name="format_quote" className="text-4xl text-primary/50 mb-6"/>
              <h3 className="font-serif text-3xl md:text-4xl leading-snug text-text-main italic">
                  "We embrace the imperfections of the handmade, for in them lies the unique soul of the artifact."
              </h3>
              <p className="text-sm font-bold uppercase tracking-wider text-text-subtle mt-8">- The Pitalya Family</p>
          </div>
      </Section>

      {/* Newsletter Section */}
      <Section className="border-t border-[#e5e0d8]" py="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="mb-6">
            <Icon name="mail" className="text-4xl text-primary" />
          </div>
          <h2 className="text-text-main font-serif text-3xl md:text-4xl font-medium mb-4">Join our Legacy</h2>
          <p className="text-text-subtle mb-8">Subscribe to receive updates on new collections, artisan stories, and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 bg-white border border-[#e5e0d8] rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-text-main placeholder:text-text-subtle" />
            <button type="button" className="bg-text-main text-white px-6 py-3 rounded-lg font-bold hover:bg-primary hover:text-text-main transition-colors">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-text-subtle/70 mt-4">By subscribing, you agree to our Terms & Privacy Policy.</p>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
