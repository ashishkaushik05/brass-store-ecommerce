import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import Icon from '@/components/Icon';
import { LoadingSection } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useProducts } from '@/hooks/api/useProducts';
import { useFilterStore } from '@/store/filterStore';
import { Package } from 'lucide-react';

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    selectedCategory,
    selectedFinish,
    selectedUsage,
    priceRange,
    sortBy,
    setCategory,
    toggleFinish,
    toggleUsage,
    setSortBy,
  } = useFilterStore();

  // Build API query from filter state
  const { data, isLoading } = useProducts({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    tags: [...selectedFinish, ...selectedUsage],
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sortBy: sortBy as any,
    page,
    limit,
    isActive: true,
  });

  const products = data?.products || [];
  const pagination = data?.pagination;

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'God Idols', label: 'God Idols' },
    { value: 'Brass Utensils', label: 'Brass Utensils' },
    { value: 'Home Decor', label: 'Home Decor' },
    { value: 'Wall Art', label: 'Wall Art' },
    { value: 'Lamps & Diyas', label: 'Lamps & Diyas' },
  ];

  const usageOptions = ['Puja', 'Kitchen', 'Decor', 'Gifting'];
  const finishOptions = ['Antique', 'Polished', 'Black Oxide'];
  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 py-8">
      {/* Breadcrumbs & Heading */}
      <div className="mb-8">
        <div className="flex gap-2 text-sm mb-4 text-text-subtle">
          <Link to="/" className="hover:underline hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-text-main font-medium">Shop All Brass</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#e5e2db] pb-8">
          <div className="max-w-2xl">
            <h1 className="text-text-main text-4xl md:text-5xl font-serif font-light mb-4">Shop All Brass</h1>
            <p className="text-[#59554b] text-lg font-light leading-relaxed">
              Discover timeless elegance with our range of handcrafted brassware. Each piece is forged by master artisans using traditional techniques passed down through generations.
            </p>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-subtle mb-2">Sort By</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-[#e5e2db] text-text-main py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="-averageRating">Best Sellers</option>
                <option value="-createdAt">Newest Arrivals</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-subtle">
                <Icon name="expand_more" className="text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-lg font-bold mb-6">Filters</h3>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-text-main mb-4">Category</h4>
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.value}
                      onChange={() => {
                        setCategory(cat.value);
                        setPage(1); // Reset to first page on filter change
                      }}
                      className="size-4 rounded-full border-gray-300 text-primary focus:ring-primary bg-white"
                    />
                    <span className="text-[#59554b] group-hover:text-primary transition-colors">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-[#e5e2db] my-6"/>

             {/* Usage Filter */}
             <div className="mb-6">
              <h4 className="font-medium text-text-main mb-4">Usage</h4>
              <div className="space-y-3">
                {usageOptions.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedUsage.includes(item)}
                      onChange={() => {
                        toggleUsage(item);
                        setPage(1);
                      }}
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary bg-white"
                    />
                    <span className="text-[#59554b] group-hover:text-primary transition-colors">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <hr className="border-[#e5e2db] my-6"/>

            {/* Finish Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-text-main mb-4">Finish</h4>
              <div className="space-y-3">
                {finishOptions.map(item => (
                  <label key={item} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedFinish.includes(item)}
                      onChange={() => {
                        toggleFinish(item);
                        setPage(1);
                      }}
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary bg-white"
                    />
                    <span className="text-[#59554b] group-hover:text-primary transition-colors">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-[#e5e2db] my-6"/>

            {/* Price Filter */}
            <div className="mb-8">
              <h4 className="font-medium text-text-main mb-4">Price Range</h4>
              <div className="px-1">
                <input type="range" min="0" max="20000" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-primary" />
                <div className="flex justify-between mt-3 text-sm text-[#59554b]">
                  <span>₹0</span>
                  <span>₹20,000+</span>
                </div>
              </div>
            </div>

            <button className="w-full py-3 px-4 bg-text-main text-white font-semibold rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wider text-sm">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          {isLoading ? (
            <LoadingSection message="Loading products..." />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description="Try adjusting your filters to see more results."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                {products.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center mt-16">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="size-10 flex items-center justify-center rounded-lg border border-[#e5e2db] hover:bg-[#e5e2db] text-text-main transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="chevron_left" className="text-sm" />
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.pages ||
                        Math.abs(pageNum - page) <= 1
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`size-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                              page === pageNum
                                ? 'bg-primary text-text-main'
                                : 'border border-[#e5e2db] hover:bg-[#e5e2db] text-text-main'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return <span key={pageNum} className="flex items-center px-2">...</span>;
                      }
                      return null;
                    })}
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="size-10 flex items-center justify-center rounded-lg border border-[#e5e2db] hover:bg-[#e5e2db] text-text-main transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon name="chevron_right" className="text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default ShopPage;
