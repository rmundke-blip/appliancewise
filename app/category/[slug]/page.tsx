'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory, products, categories } from '@/lib/data';

const ENERGY_RATINGS = ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const categoryProducts = getProductsByCategory(slug);
  const category = categories.find(c => c.slug === slug);

  const allBrands = useMemo(() => {
    return Array.from(new Set(categoryProducts.map(p => p.brand))).sort();
  }, [categoryProducts]);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedEnergy, setSelectedEnergy] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const maxPrice = useMemo(() => Math.max(...categoryProducts.map(p => p.price), 200000), [categoryProducts]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleEnergy = (rating: string) => {
    setSelectedEnergy(prev =>
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setSelectedEnergy([]);
    setSearchQuery('');
  };

  const filtered = useMemo(() => {
    let result = categoryProducts.filter(p => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      if (selectedEnergy.length > 0 && p.energyRating && !selectedEnergy.some(e => p.energyRating?.includes(e.replace(' Star', '')))) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'discount': return (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp;
        default: return b.reviewCount - a.reviewCount;
      }
    });

    return result;
  }, [categoryProducts, selectedBrands, priceRange, minRating, selectedEnergy, searchQuery, sortBy]);

  const hasFilters = selectedBrands.length > 0 || minRating > 0 || selectedEnergy.length > 0 || searchQuery;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold text-[#E6EDF3] mb-3">Brand</h3>
        <div className="space-y-2">
          {allBrands.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleBrand(brand)}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                  selectedBrands.includes(brand)
                    ? 'bg-[#00D4AA] border-[#00D4AA]'
                    : 'border-[#30363D] group-hover:border-[#00D4AA]/60'
                }`}
              >
                {selectedBrands.includes(brand) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#0D1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleBrand(brand)}
                className={`text-sm cursor-pointer ${selectedBrands.includes(brand) ? 'text-[#00D4AA]' : 'text-[#8B949E] group-hover:text-[#E6EDF3]'}`}
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-[#E6EDF3] mb-3">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={1000}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[#8B949E]">
            <span>₹0</span>
            <span className="text-[#00D4AA] font-semibold">Up to ₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold text-[#E6EDF3] mb-3">Minimum Rating</h3>
        <div className="flex gap-2">
          {[4, 3, 2].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                minRating === r
                  ? 'bg-[#FFB020]/15 text-[#FFB020] border-[#FFB020]/40'
                  : 'border-[#30363D] text-[#8B949E] hover:border-[#FFB020]/40'
              }`}
            >
              {r}+ ★
            </button>
          ))}
        </div>
      </div>

      {/* Energy Rating */}
      {categoryProducts.some(p => p.energyRating) && (
        <div>
          <h3 className="text-sm font-semibold text-[#E6EDF3] mb-3">Energy Rating</h3>
          <div className="space-y-2">
            {ENERGY_RATINGS.map(er => (
              <label key={er} className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => toggleEnergy(er)}
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                    selectedEnergy.includes(er)
                      ? 'bg-[#3FB950] border-[#3FB950]'
                      : 'border-[#30363D] group-hover:border-[#3FB950]/60'
                  }`}
                >
                  {selectedEnergy.includes(er) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#0D1117" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => toggleEnergy(er)}
                  className={`text-sm cursor-pointer ${selectedEnergy.includes(er) ? 'text-[#3FB950]' : 'text-[#8B949E] group-hover:text-[#E6EDF3]'}`}
                >
                  {er} ⚡
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 rounded-xl border border-[#F85149]/40 text-[#F85149] text-sm hover:bg-[#F85149]/10 transition-colors flex items-center justify-center gap-2"
        >
          <X size={14} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  if (categoryProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-[#8B949E]">No products found in this category yet.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="pt-20 min-h-screen">
        {/* Header */}
        <div className="bg-[#161B22]/50 border-b border-[#30363D] py-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{category?.emoji}</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3]">
                {category?.name || slug}
              </h1>
            </div>
            <p className="text-[#8B949E]">{category?.description} · {categoryProducts.length} products</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Search + Sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search in ${category?.name}...`}
                className="w-full bg-[#161B22] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#E6EDF3] placeholder:text-[#8B949E] focus:outline-none focus:border-[#00D4AA] transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors sm:hidden ${
                  hasFilters ? 'border-[#00D4AA]/50 text-[#00D4AA]' : 'border-[#30363D] text-[#8B949E]'
                }`}
              >
                <SlidersHorizontal size={15} />
                Filters {hasFilters && `(${selectedBrands.length + (minRating > 0 ? 1 : 0) + selectedEnergy.length})`}
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-2.5 pr-8 text-sm text-[#E6EDF3] focus:outline-none focus:border-[#00D4AA] cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B949E] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden sm:block w-56 flex-shrink-0">
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#E6EDF3] text-sm flex items-center gap-2">
                    <SlidersHorizontal size={14} />
                    Filters
                  </h2>
                </div>
                <FilterSidebar />
              </div>
            </aside>

            {/* Mobile filter overlay */}
            {filtersOpen && (
              <div className="sm:hidden fixed inset-0 z-40 bg-black/80 flex items-end" onClick={() => setFiltersOpen(false)}>
                <div className="bg-[#161B22] border-t border-[#30363D] rounded-t-3xl w-full max-h-[80vh] overflow-y-auto p-6"
                  onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-[#E6EDF3]">Filters</h2>
                    <button onClick={() => setFiltersOpen(false)} className="text-[#8B949E]"><X size={18} /></button>
                  </div>
                  <FilterSidebar />
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-full mt-6 py-3 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm"
                  >
                    Show {filtered.length} Results
                  </button>
                </div>
              </div>
            )}

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#8B949E]">
                  Showing <span className="text-[#E6EDF3] font-semibold">{filtered.length}</span> of {categoryProducts.length} products
                </p>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-[#E6EDF3] font-semibold mb-2">No products match your filters</p>
                  <p className="text-[#8B949E] text-sm mb-6">Try adjusting your filters or clearing them</p>
                  <button onClick={clearFilters} className="px-5 py-2.5 rounded-xl bg-[#00D4AA] text-[#0D1117] text-sm font-semibold">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} showCompare />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
