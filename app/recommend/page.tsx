'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products, getProductPrimaryImage, formatPrice } from '@/lib/data';

const categories = [
  { name: 'TVs', value: 'tvs' },
  { name: 'Refrigerators', value: 'refrigerators' },
  { name: 'Air Conditioners', value: 'air-conditioners' },
  { name: 'Washing Machines', value: 'washing-machines' },
  { name: 'Water Purifiers', value: 'water-purifiers' },
];

const budgetRanges = [
  { label: 'Budget (< ₹30K)', min: 0, max: 30000 },
  { label: 'Mid-range (₹30K - ₹70K)', min: 30000, max: 70000 },
  { label: 'Premium (₹70K - ₹150K)', min: 70000, max: 150000 },
  { label: 'Luxury (> ₹150K)', min: 150000, max: 999999 },
];

export default function RecommendPage() {
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<{ min: number; max: number } | null>(null);
  const [showResults, setShowResults] = useState(false);

  const recommendations = selectedCategory && selectedBudget
    ? products
        .filter(p => p.categorySlug === selectedCategory && p.price >= selectedBudget.min && p.price <= selectedBudget.max)
        .sort((a, b) => {
          const aScore = (a.rating * 20) + (a.sentiment.positive * 0.5);
          const bScore = (b.rating * 20) + (b.sentiment.positive * 0.5);
          return bScore - aScore;
        })
        .slice(0, 6)
    : [];

  const handleRecommend = () => {
    if (selectedCategory && selectedBudget) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {!showResults ? (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-sm font-medium mb-6">
                <Sparkles size={14} />
                AI-Powered Recommendations
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#E6EDF3] mb-4">
                Find Your Perfect Appliance
              </h1>
              <p className="text-[#8B949E] text-lg">
                Answer a few quick questions and our AI will recommend the best products for you.
              </p>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8">
              {step === 0 ? (
                <>
                  <h2 className="font-semibold text-xl text-[#E6EDF3] mb-6">What appliance are you looking for?</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setStep(1);
                        }}
                        className="p-4 rounded-xl border border-[#30363D] hover:border-[#00D4AA] hover:bg-[#00D4AA]/5 transition-all text-[#E6EDF3] text-left font-medium hover:text-[#00D4AA]"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <button
                      onClick={() => setStep(0)}
                      className="text-[#8B949E] hover:text-[#00D4AA] text-sm font-medium flex items-center gap-1"
                    >
                      ← Change category
                    </button>
                  </div>
                  <h2 className="font-semibold text-xl text-[#E6EDF3] mb-6">What's your budget?</h2>
                  <div className="space-y-3">
                    {budgetRanges.map(budget => (
                      <button
                        key={budget.label}
                        onClick={() => setSelectedBudget({ min: budget.min, max: budget.max })}
                        className={`w-full p-4 rounded-xl border transition-all text-left font-medium ${
                          selectedBudget?.min === budget.min
                            ? 'border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]'
                            : 'border-[#30363D] hover:border-[#00D4AA] hover:bg-[#00D4AA]/5 text-[#E6EDF3] hover:text-[#00D4AA]'
                        }`}
                      >
                        {budget.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleRecommend}
                    disabled={!selectedBudget}
                    className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold hover:bg-[#00D4AA]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Sparkles size={16} />
                    Get Recommendations
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3] mb-2">
                  Recommended for You
                </h1>
                <p className="text-[#8B949E]">Based on your preferences and budget</p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 rounded-lg bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#00D4AA] hover:border-[#00D4AA]/40 transition-colors text-sm font-medium"
              >
                New Search
              </button>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendations.map(product => (
                  <div key={product.id} className="group relative bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden card-glow flex flex-col">
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#1F2937] to-[#111827] flex items-center justify-center h-52">
                      <img
                        src={getProductPrimaryImage(product)}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          const alternateImages = product.images.filter(img => img !== getProductPrimaryImage(product));
                          if (alternateImages.length > 0) {
                            img.src = alternateImages[0];
                          } else {
                            img.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&q=80';
                          }
                        }}
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <div>
                        <p className="text-xs text-[#00D4AA] font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
                        <h3 className="font-semibold text-[#E6EDF3] text-base line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      <div className="text-sm text-[#8B949E] space-y-0.5">
                        <p>⭐ {product.rating} rating ({product.reviewCount.toLocaleString('en-IN')} reviews)</p>
                        {product.energyRating && <p>⚡ {product.energyRating} BEE Rated</p>}
                      </div>

                      <div className="flex items-baseline gap-2 mt-auto pt-2">
                        <span className="font-bold text-[#E6EDF3] text-xl">
                          {formatPrice(product.price)}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-[#8B949E] line-through">
                            {formatPrice(product.mrp)}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#00D4AA] text-[#0D1117] text-sm font-semibold hover:bg-[#00D4AA]/90 transition-colors"
                        >
                          <ShoppingCart size={14} />
                          Buy Now
                        </Link>
                        <Link
                          href={`/product/${product.id}`}
                          className="flex items-center justify-center px-3 py-2 rounded-xl text-[#8B949E] text-xs font-medium hover:text-[#00D4AA] border border-[#30363D] hover:border-[#00D4AA]/40 transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#30363D] bg-[#161B22] p-10 text-center">
                <p className="text-[#8B949E] text-lg mb-4">No products found in your budget range.</p>
                <p className="text-[#6E7681] text-sm">Try adjusting your budget or selecting a different category.</p>
                <button
                  onClick={() => setShowResults(false)}
                  className="mt-6 px-6 py-2 rounded-lg bg-[#00D4AA] text-[#0D1117] font-semibold hover:bg-[#00D4AA]/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}