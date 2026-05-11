'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronLeft, ChevronRight, Star, ArrowRight, CircleCheck as CheckCircle, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products, categories, formatPrice, type Product } from '@/lib/data';

type WizardData = {
  category: string;
  familySize: number;
  homeType: string;
  budget: number;
  needs: string[];
};

const HOME_TYPES = ['1BHK Apartment', '2BHK Apartment', '3BHK Apartment', 'Independent House', 'Villa'];

const SPECIAL_NEEDS: Record<string, string[]> = {
  tvs: ['Large Screen (55"+)', 'Gaming', '4K HDR', 'Energy Saving', 'Built-in Soundbar', 'Smart Features'],
  refrigerators: ['Large Family', 'Energy Saving', 'Vegetarian Heavy Use', 'Power Cut Areas', 'Hard Water Area', 'Frequent Load Shedding'],
  'air-conditioners': ['Very Hot Climate', 'Energy Saving', 'Large Room', 'Frequent Voltage Fluctuations', 'Monsoon Humidity', 'Silent Operation'],
  'washing-machines': ['Hard Water Area', 'Delicate Fabrics', 'Large Family', 'Energy Saving', 'Quick Wash Needed', 'Water Scarce Area'],
  'water-purifiers': ['Very High TDS Water', 'Hard Water', 'Municipal Supply', 'Borewell Water', 'Large Family', 'Budget Conscious'],
  default: ['Energy Saving', 'Budget Friendly', 'Best Brand', 'Low Maintenance', 'Large Family', 'Indian Conditions'],
};

const BUDGET_RANGES: Record<string, [number, number, number]> = {
  tvs: [15000, 300000, 50000],
  refrigerators: [15000, 200000, 40000],
  'air-conditioners': [25000, 150000, 45000],
  'washing-machines': [15000, 100000, 40000],
  'water-purifiers': [5000, 40000, 15000],
  default: [5000, 200000, 30000],
};

function getMatchScore(product: Product, data: WizardData): number {
  let score = 50;
  score += product.rating * 5;
  score += Math.min(product.sentiment.positive * 0.2, 15);

  if (product.price <= data.budget) score += 20;
  else if (product.price <= data.budget * 1.15) score += 10;
  else score -= 15;

  if (data.needs.includes('Energy Saving') && product.energyRating?.includes('5')) score += 10;
  if (data.needs.includes('Energy Saving') && product.energyRating?.includes('4')) score += 5;
  if (data.needs.includes('Large Family') && data.familySize >= 5) score += 8;
  if (data.needs.includes('Budget Friendly') && product.price <= data.budget * 0.8) score += 10;

  if (product.badge === 'Best Seller' || product.badge === 'Most Popular') score += 5;
  if (product.badge === 'Editor\'s Choice') score += 8;

  return Math.min(Math.max(Math.round(score), 55), 98);
}

function getRecommendations(data: WizardData): Array<{ product: Product; score: number; reason: string }> {
  const categoryProducts = products.filter(p => p.categorySlug === data.category);
  if (categoryProducts.length === 0) return [];

  const scored = categoryProducts.map(product => {
    const score = getMatchScore(product, data);
    const reasons = [];
    if (product.rating >= 4.4) reasons.push('top-rated');
    if (product.sentiment.positive >= 75) reasons.push('highly recommended by users');
    if (product.price <= data.budget) reasons.push('within your budget');
    if (product.energyRating?.includes('5')) reasons.push('5-star energy efficient');
    if (product.badge) reasons.push(product.badge.toLowerCase());

    return {
      product,
      score,
      reason: reasons.slice(0, 2).join(', ') || 'good overall value',
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    category: '',
    familySize: 4,
    homeType: '2BHK Apartment',
    budget: 50000,
    needs: [],
  });
  const [recommendations, setRecommendations] = useState<Array<{ product: Product; score: number; reason: string }>>([]);
  const [thinkingProgress, setThinkingProgress] = useState(0);

  const totalSteps = 5;

  const budgetRange = BUDGET_RANGES[data.category] || BUDGET_RANGES.default;
  const needsOptions = SPECIAL_NEEDS[data.category] || SPECIAL_NEEDS.default;

  useEffect(() => {
    if (step === 4) {
      setThinkingProgress(0);
      const categoryProducts = products.filter(p => p.categorySlug === data.category);
      if (categoryProducts.length === 0) {
        setStep(1);
        return;
      }
      const interval = setInterval(() => {
        setThinkingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            const recs = getRecommendations(data);
            setRecommendations(recs);
            setTimeout(() => setStep(5), 400);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step, data.category]);

  const selectedCategory = categories.find(c => c.slug === data.category);

  const toggleNeed = (need: string) => {
    setData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need],
    }));
  };

  const handleCategorySelect = (slug: string) => {
    const range = BUDGET_RANGES[slug] || BUDGET_RANGES.default;
    setData(prev => ({ ...prev, category: slug, budget: range[2], needs: [] }));
  };

  const reset = () => {
    setStep(1);
    setData({ category: '', familySize: 4, homeType: '2BHK Apartment', budget: 50000, needs: [] });
    setRecommendations([]);
  };

  const thinkingMessages = [
    'Analysing Indian market data...',
    'Checking voltage tolerance for your region...',
    'Evaluating energy efficiency ratings...',
    'Comparing prices across platforms...',
    'Reading 10,000+ consumer reviews...',
    'Calculating your perfect match score...',
  ];

  const [thinkingMsg, setThinkingMsg] = useState(0);
  useEffect(() => {
    if (step !== 4) return;
    const interval = setInterval(() => {
      setThinkingMsg(prev => (prev + 1) % thinkingMessages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6 min-h-screen">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mt-10 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-sm font-medium mb-5">
            <Sparkles size={14} />
            AI-Powered Recommendations
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#E6EDF3] mb-3">
            Find Your Perfect Match
          </h1>
          <p className="text-[#8B949E] text-base">
            Answer 3 quick questions. Our AI analyses Indian market data, consumer reviews, and your exact needs.
          </p>
        </div>

        {/* Progress bar */}
        {step < 5 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex justify-between text-xs text-[#8B949E] mb-2">
              <span>Step {Math.min(step, 4)} of 4</span>
              <span>{Math.round((Math.min(step, 4) / 4) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-[#161B22] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00D4AA] rounded-full transition-all duration-500"
                style={{ width: `${(Math.min(step, 4) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* ─── STEP 1: Category ─── */}
          {step === 1 && (
            <div className="step-animate">
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8">
                <h2 className="font-display text-2xl font-bold text-[#E6EDF3] mb-2">
                  What appliance are you looking for?
                </h2>
                <p className="text-[#8B949E] text-sm mb-7">Select a category to get started</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map(cat => {
                    const hasProducts = products.some(p => p.categorySlug === cat.slug);
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => hasProducts && handleCategorySelect(cat.slug)}
                        disabled={!hasProducts}
                        className={`relative flex flex-col items-center gap-2.5 p-5 rounded-2xl border text-center transition-all ${
                          data.category === cat.slug
                            ? 'border-[#00D4AA] bg-[#00D4AA]/10'
                            : hasProducts
                            ? 'border-[#30363D] hover:border-[#00D4AA]/50 hover:bg-[#00D4AA]/5 cursor-pointer'
                            : 'border-[#30363D] opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {data.category === cat.slug && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00D4AA] flex items-center justify-center">
                            <CheckCircle size={12} className="text-[#0D1117]" />
                          </div>
                        )}
                        <span className="text-3xl">{cat.emoji}</span>
                        <span className={`text-sm font-medium ${data.category === cat.slug ? 'text-[#00D4AA]' : 'text-[#E6EDF3]'}`}>
                          {cat.name}
                        </span>
                        {!hasProducts && <span className="text-[10px] text-[#8B949E]">Coming soon</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end mt-5">
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.category}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00D4AA]/90 transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Details ─── */}
          {step === 2 && (
            <div className="step-animate">
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8 space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#E6EDF3] mb-2">
                    Tell us about your home
                  </h2>
                  <p className="text-[#8B949E] text-sm">This helps us find the right size and capacity</p>
                </div>

                {/* Family size */}
                <div>
                  <label className="text-sm font-semibold text-[#E6EDF3] block mb-3">
                    Family Size
                    <span className="ml-2 text-[#00D4AA]">{data.familySize} members</span>
                  </label>
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <button
                        key={n}
                        onClick={() => setData(prev => ({ ...prev, familySize: n }))}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
                          data.familySize === n
                            ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0D1117]'
                            : 'border-[#30363D] text-[#8B949E] hover:border-[#00D4AA]/50'
                        }`}
                      >
                        {n}{n === 6 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Home type */}
                <div>
                  <label className="text-sm font-semibold text-[#E6EDF3] block mb-3">Home Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {HOME_TYPES.map(type => (
                      <button
                        key={type}
                        onClick={() => setData(prev => ({ ...prev, homeType: type }))}
                        className={`py-3 px-4 rounded-xl text-sm font-medium border text-left transition-all ${
                          data.homeType === type
                            ? 'bg-[#00D4AA]/10 border-[#00D4AA]/60 text-[#00D4AA]'
                            : 'border-[#30363D] text-[#8B949E] hover:border-[#00D4AA]/40'
                        }`}
                      >
                        {data.homeType === type && '✓ '}{type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-sm font-semibold text-[#E6EDF3] block mb-3">
                    Your Budget
                    <span className="ml-2 text-[#00D4AA]">{formatPrice(data.budget)}</span>
                  </label>
                  <input
                    type="range"
                    min={budgetRange[0]}
                    max={budgetRange[1]}
                    step={1000}
                    value={data.budget}
                    onChange={e => setData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-[#8B949E] mt-1.5">
                    <span>{formatPrice(budgetRange[0])}</span>
                    <span>{formatPrice(budgetRange[1])}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#8B949E] transition-colors text-sm"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm hover:bg-[#00D4AA]/90 transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Special Needs ─── */}
          {step === 3 && (
            <div className="step-animate">
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8">
                <h2 className="font-display text-2xl font-bold text-[#E6EDF3] mb-2">
                  Any special requirements?
                </h2>
                <p className="text-[#8B949E] text-sm mb-7">Select all that apply (optional)</p>

                <div className="flex flex-wrap gap-3">
                  {needsOptions.map(need => (
                    <button
                      key={need}
                      onClick={() => toggleNeed(need)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all ${
                        data.needs.includes(need)
                          ? 'bg-[#00D4AA]/15 border-[#00D4AA] text-[#00D4AA]'
                          : 'border-[#30363D] text-[#8B949E] hover:border-[#00D4AA]/50 hover:text-[#E6EDF3]'
                      }`}
                    >
                      {data.needs.includes(need) && '✓ '}{need}
                    </button>
                  ))}
                </div>

                {data.needs.length > 0 && (
                  <p className="text-xs text-[#00D4AA] mt-4">
                    {data.needs.length} requirement{data.needs.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div className="flex justify-between mt-5">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] transition-colors text-sm"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm hover:bg-[#00D4AA]/90 transition-colors"
                >
                  <Sparkles size={15} />
                  Get AI Recommendations
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 4: AI Thinking ─── */}
          {step === 4 && (
            <div className="step-animate">
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-12 text-center">
                {/* Pulsing orb */}
                <div className="relative mx-auto w-24 h-24 mb-8">
                  <div className="absolute inset-0 rounded-full bg-[#00D4AA]/20 ai-pulse" />
                  <div className="absolute inset-2 rounded-full bg-[#00D4AA]/30 ai-pulse-2" />
                  <div className="absolute inset-4 rounded-full bg-[#00D4AA]/40 ai-pulse-3" />
                  <div className="absolute inset-6 rounded-full bg-[#00D4AA] flex items-center justify-center">
                    <Sparkles size={20} className="text-[#0D1117]" />
                  </div>
                </div>

                <h2 className="font-display text-2xl font-bold text-[#E6EDF3] mb-3">
                  AI is Working...
                </h2>
                <p className="text-[#00D4AA] text-sm font-medium mb-8 min-h-[20px] transition-all">
                  {thinkingMessages[thinkingMsg]}
                </p>

                {/* Progress */}
                <div className="max-w-xs mx-auto">
                  <div className="h-2 bg-[#0D1117] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D4AA] to-[#00D4AA]/60 rounded-full transition-all duration-200"
                      style={{ width: `${thinkingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#8B949E]">{thinkingProgress}% complete</p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 justify-center">
                  {['Budget', 'Family Size', 'Energy Efficiency', 'Reviews', 'Price History'].map(param => (
                    <span key={param} className="px-3 py-1 rounded-full bg-[#0D1117] border border-[#30363D] text-xs text-[#8B949E]">
                      {param}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 5: Results ─── */}
          {step === 5 && recommendations.length > 0 && (
            <div className="step-animate space-y-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3FB950]/10 border border-[#3FB950]/20 text-[#3FB950] text-sm font-medium mb-4">
                  <CheckCircle size={14} />
                  Analysis Complete
                </div>
                <h2 className="font-display text-3xl font-bold text-[#E6EDF3] mb-2">
                  Your Top Recommendations
                </h2>
                <p className="text-[#8B949E] text-sm">
                  Based on your {selectedCategory?.name} search · Budget {formatPrice(data.budget)} · Family of {data.familySize}
                </p>
              </div>

              {recommendations.map(({ product, score, reason }, index) => (
                <div
                  key={product.id}
                  className={`bg-[#161B22] border rounded-3xl overflow-hidden transition-all ${
                    index === 0 ? 'border-[#00D4AA]/60' : 'border-[#30363D]'
                  }`}
                >
                  {index === 0 && (
                    <div className="bg-[#00D4AA] px-5 py-2.5 flex items-center gap-2">
                      <Sparkles size={14} className="text-[#0D1117]" />
                      <span className="text-[#0D1117] text-sm font-bold">AI Best Pick for You</span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex gap-5">
                      {/* Image */}
                      <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#1F2937] to-[#111827]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[#00D4AA] text-xs font-semibold uppercase mb-1">{product.brand}</p>
                            <h3 className="text-[#E6EDF3] font-semibold text-base leading-snug line-clamp-2">
                              {product.name}
                            </h3>
                          </div>

                          {/* Match score */}
                          <div className="flex-shrink-0 text-center">
                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border ${
                              index === 0 ? 'bg-[#00D4AA]/15 border-[#00D4AA]/40' : 'bg-[#161B22] border-[#30363D]'
                            }`}>
                              <span className={`font-bold text-base leading-none ${index === 0 ? 'text-[#00D4AA]' : 'text-[#E6EDF3]'}`}>
                                {score}%
                              </span>
                              <span className="text-[#8B949E] text-[9px] mt-0.5">match</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D]'} />
                            ))}
                          </div>
                          <span className="text-xs text-[#8B949E]">{product.rating} · {product.reviewCount.toLocaleString('en-IN')} reviews</span>
                        </div>

                        <p className="text-xs text-[#8B949E] mt-2">
                          <span className="text-[#3FB950]">Why: </span>
                          {reason.charAt(0).toUpperCase() + reason.slice(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#30363D]">
                      <div>
                        <span className="text-xl font-bold text-[#E6EDF3]">{formatPrice(product.price)}</span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-[#8B949E] line-through ml-2">{formatPrice(product.mrp)}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm hover:bg-[#00D4AA]/90 transition-colors"
                        >
                          View Details
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-4">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#30363D] text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#8B949E] transition-colors text-sm"
                >
                  <RotateCcw size={14} />
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
