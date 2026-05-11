'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Sparkles, ShieldCheck, Award, TrendingUp, ChevronRight, Zap, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { categories, getTrendingTVs, formatPrice, products, getProductPrimaryImage } from '@/lib/data';

const trustBadges = [
  { icon: ShieldCheck, label: '100% Unbiased Reviews' },
  { icon: Award, label: '50,000+ Products Tested' },
  { icon: TrendingUp, label: 'Real-time Price Tracking' },
  { icon: Sparkles, label: 'AI-Powered Recommendations' },
];

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const trendingTVs = getTrendingTVs();
  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? products.filter(product =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.brand.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.categorySlug.toLowerCase().includes(normalizedQuery)
      ).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-blob-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#00D4AA] opacity-[0.08] blur-[120px]" />
          <div className="animate-blob-2 absolute -bottom-32 -right-16 w-[500px] h-[500px] rounded-full bg-[#7C3AED] opacity-[0.07] blur-[120px]" />
          <div className="animate-blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#00D4AA] opacity-[0.04] blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-sm font-medium mb-8">
            <Sparkles size={14} />
            <span>AI-Powered Buying Guide for India</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-[#E6EDF3]">Find Your Perfect</span>
            <br />
            <span className="text-[#00D4AA]">Appliance</span>
          </h1>

          <p className="text-[#8B949E] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Compare 50,000+ products, read verified Indian consumer reviews, and get personalised AI recommendations — all in one place.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-[#161B22] border border-[#30363D] rounded-full p-2 focus-within:border-[#00D4AA] transition-colors shadow-2xl">
              <Search size={20} className="ml-4 text-[#8B949E] flex-shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search TVs, ACs, Refrigerators, Washing Machines..."
                className="flex-1 bg-transparent px-4 py-2 text-[#E6EDF3] placeholder:text-[#8B949E] focus:outline-none text-base"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00D4AA] text-[#0D1117] font-semibold rounded-full text-sm hover:bg-[#00D4AA]/90 transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {query.trim() && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-[#30363D] bg-[#161B22] overflow-hidden shadow-lg shadow-black/20">
              {searchResults.length > 0 ? (
                searchResults.map(product => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors border-b border-[#30363D] last:border-b-0"
                    onClick={() => setQuery('')}
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#0D1117] overflow-hidden flex-shrink-0">
                      <img src={getProductPrimaryImage(product)} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#E6EDF3] truncate">{product.brand} {product.name}</p>
                      <p className="text-xs text-[#8B949E] truncate">{product.category} · ₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-5 text-sm text-[#8B949E]">
                  No results found for "{query}". Try a different brand, model, or category.
                </div>
              )}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/recommend"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#00D4AA] text-[#0D1117] font-semibold text-sm hover:bg-[#00D4AA]/90 transition-all hover:scale-105 shadow-lg shadow-[#00D4AA]/20"
            >
              <Sparkles size={16} />
              Get AI Recommendation
            </Link>
            <Link
              href="/category/tvs"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/5 text-[#E6EDF3] font-semibold text-sm border border-[#30363D] hover:border-[#00D4AA]/40 hover:bg-white/10 transition-all"
            >
              Browse All
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 bg-[#161B22]/80 border border-[#30363D] rounded-xl px-3 py-2.5">
                <Icon size={16} className="text-[#00D4AA] flex-shrink-0" />
                <span className="text-[#8B949E] text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#00D4AA] text-sm font-semibold uppercase tracking-wider mb-2">Browse by Category</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3]">
              Every Appliance, Covered
            </h2>
          </div>
          <Link href="/category/tvs" className="hidden sm:flex items-center gap-1 text-sm text-[#8B949E] hover:text-[#00D4AA] transition-colors">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative bg-[#161B22] border border-[#30363D] rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-[#00D4AA]/50 transition-all duration-300 hover:bg-[#161B22]/80 teal-glow overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/0 to-[#00D4AA]/0 group-hover:from-[#00D4AA]/5 group-hover:to-transparent transition-all duration-300" />
              <span className="text-4xl leading-none">{cat.emoji}</span>
              <div>
                <p className="text-[#E6EDF3] font-semibold text-sm group-hover:text-[#00D4AA] transition-colors">{cat.name}</p>
                <p className="text-[#8B949E] text-xs mt-0.5">{cat.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── TRENDING TVs ─── */}
      <section className="py-16 bg-[#161B22]/30">
        <div className="px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#00D4AA] text-sm font-semibold uppercase tracking-wider mb-2">Trending Now</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3]">
                Top Rated TVs
              </h2>
              <p className="text-[#8B949E] mt-2 text-sm">Best selling televisions in India this month</p>
            </div>
            <Link href="/category/tvs" className="hidden sm:flex items-center gap-1 text-sm text-[#8B949E] hover:text-[#00D4AA] transition-colors">
              See all TVs <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trendingTVs.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '50,000+', label: 'Products Reviewed', color: 'text-[#00D4AA]' },
            { value: '4.2M+', label: 'Indian Consumers Helped', color: 'text-[#3FB950]' },
            { value: '₹2,400 Cr+', label: 'Savings Facilitated', color: 'text-[#FFB020]' },
            { value: '99.2%', label: 'Recommendation Accuracy', color: 'text-[#00D4AA]' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-center">
              <p className={`font-display text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</p>
              <p className="text-[#8B949E] text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#00D4AA] text-sm font-semibold uppercase tracking-wider mb-2">Our Process</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3]">
            How ApplianceWise Works
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Describe Your Needs', desc: 'Tell our AI your family size, budget, and specific requirements through a simple 5-step wizard.', icon: '🎯' },
            { step: '02', title: 'AI Analyses Options', desc: 'Our model processes 100+ parameters — energy efficiency, Indian voltage tolerance, service network, water quality compatibility.', icon: '🤖' },
            { step: '03', title: 'Get Best Match', desc: 'Receive personalised top-3 recommendations with match scores, price comparisons across Flipkart, Amazon, Croma, and more.', icon: '🏆' },
          ].map(item => (
            <div key={item.step} className="relative bg-[#161B22] border border-[#30363D] rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-5">
                <span className="text-4xl">{item.icon}</span>
                <span className="text-[#00D4AA] font-display font-bold text-2xl">{item.step}</span>
              </div>
              <h3 className="text-[#E6EDF3] font-semibold text-lg mb-3">{item.title}</h3>
              <p className="text-[#8B949E] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AI RECOMMENDATION BANNER ─── */}
      <section className="py-8 px-4 sm:px-6 max-w-7xl mx-auto mb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00D4AA]/15 via-[#161B22] to-[#0D1117] border border-[#00D4AA]/20 p-10 sm:p-14">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4AA] opacity-10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7C3AED] opacity-10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] text-sm font-medium mb-4 border border-[#00D4AA]/20">
                <Sparkles size={14} />
                AI-Powered for India
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3] mb-3">
                Not Sure What to Buy?
              </h2>
              <p className="text-[#8B949E] text-base max-w-lg leading-relaxed">
                Our AI considers your city's climate, local water quality, voltage fluctuations, and your lifestyle to recommend the perfect appliance.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                {['Handles voltage fluctuations', 'Works in Indian summers', 'Optimised for hard water'].map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 text-xs text-[#8B949E] bg-white/5 rounded-full px-3 py-1.5 border border-[#30363D]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/recommend"
                className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#00D4AA] text-[#0D1117] font-bold text-base hover:bg-[#00D4AA]/90 transition-all hover:scale-105 shadow-xl shadow-[#00D4AA]/20"
              >
                <Sparkles size={18} />
                Start AI Wizard
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RECENT REVIEWS ─── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[#00D4AA] text-sm font-semibold uppercase tracking-wider mb-2">Community</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3]">
            Real Reviews from Indian Consumers
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { name: 'Rajesh Kumar, Delhi', product: 'Sony Bravia X75L', rating: 5, text: 'Handles Delhi voltage fluctuations perfectly. Bought during Diwali sale and the picture quality is outstanding even in our bright living room.', avatar: 'RK' },
            { name: 'Priya Nair, Chennai', product: 'Daikin 1.5T 5-Star AC', rating: 5, text: 'Finally an AC that cools our home in 44-degree Chennai summer without tripping! The energy bills also reduced by 35% compared to our old AC.', avatar: 'PN' },
            { name: 'Sanjay Patel, Ahmedabad', product: 'Kent Grand Plus', rating: 4, text: 'Ahmedabad water TDS is 1200+ and Kent handles it beautifully. The water tastes clean and the filter change alerts are very useful.', avatar: 'SP' },
          ].map(review => (
            <div key={review.name} className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D]'} />
                ))}
              </div>
              <p className="text-[#E6EDF3] text-sm leading-relaxed mb-5">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/30 flex items-center justify-center text-[#00D4AA] text-xs font-bold">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-[#E6EDF3] text-xs font-semibold">{review.name}</p>
                  <p className="text-[#8B949E] text-xs">{review.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
