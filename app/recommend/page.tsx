'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronLeft, ChevronRight, Star, ArrowRight, CircleCheck as CheckCircle, RotateCcw, ExternalLink } from 'lucide-react';
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
  if (product.categorySlug !== data.category) return 0;

  let score = 50;
  score += product.rating * 5;
  score += Math.min(product.sentiment.positive * 0.2, 15);

  if (product.price <= data.budget) score += 20;
  else if (product.price <= data.budget * 1.15) score += 10;
  else score -= 30; 

  if (data.needs.includes('Energy Saving') && product.energyRating?.includes('5')) score += 15;
  if (data.needs.includes('Large Family') && data.familySize >= 4) score += 10;
  
  return Math.min(Math.max(Math.round(score), 30), 98);
}

function getRecommendations(data: WizardData): Array<{ product: Product; score: number; reason: string }> {
  const categoryProducts = products.filter(p => p.categorySlug === data.category);
  
  if (categoryProducts.length === 0) return [];

  const scored = categoryProducts.map(product => {
    const score = getMatchScore(product, data);
    const reasons = [];
    if (product.rating >= 4.4) reasons.push('top-rated performance');
    if (product.price <= data.budget) reasons.push('perfect budget match');
    if (product.energyRating?.includes('5')) reasons.push('highly energy efficient');
    if (product.badge) reasons.push(product.badge.toLowerCase());

    return {
      product,
      score,
      reason: reasons.slice(0, 2).join(', ') || 'reliable Indian market choice',
    };
  });

  return scored
    .filter(item => item.score > 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);
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

  const budgetRange = BUDGET_RANGES[data.category] || BUDGET_RANGES.default;
  const needsOptions = SPECIAL_NEEDS[data.category] || SPECIAL_NEEDS.default;

  useEffect(() => {
    if (step === 4) {
      setThinkingProgress(0);
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
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step, data]);

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
    'Scanning verified Indian retailers...',
    'Validating product availability...',
    'Filtering by your specific category...',
    'Evaluating energy ratings...',
    'Analyzing recent price drops...',
    'Finalizing your personalized list...',
  ];

  const [thinkingMsg, setThinkingMsg] = useState(0);
  useEffect(() => {
    if (step !== 4) return;
    const interval = setInterval(() => {
      setThinkingMsg(prev => (prev + 1) % thinkingMessages.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="pt-20 pb-16 px-4 sm:px-6 min-h-screen">
        <div className="max-w-3xl mx-auto text-center mt-10 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-sm font-medium mb-5">
            <Sparkles size={14} />
            Smart Appliance Selection
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#E6EDF3] mb-3">
            Find Your Perfect Match
          </h1>
          <p className="text-[#8B949E] text-base">
            Detailed analysis based on Indian market trends, reviews, and your home requirements.
          </p>
        </div>

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
          {step === 1 && (
            <div className="step-animate">
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8">
                <h2 className="font-display text-2xl font-bold text-[#E6EDF3] mb-2">
                  Select your appliance
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
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
                            ? 'border-[#30363D] hover:border-[#00D4AA]/50 cursor-pointer'
                            : 'border-[#30363D] opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <span className="text-3xl">{cat.emoji}</span>
                        <span className={`text-sm font-medium ${data.category === cat.slug ? 'text-[#00D4AA]' : 'text-[#E6EDF3]'}`}>
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.category}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm disabled:opacity-40 hover:bg-[#00D4AA]/90"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-animate">
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8 space-y-8">
                <h2 className="font-display text-2xl font-bold text-[#E6EDF3]">Home Requirements</h2>
                <div>
                  <label className="text-sm font-semibold text-[#E6EDF3] block mb-3">Family Size: {data.familySize}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <button
                        key={n}
                        onClick={() => setData(prev => ({ ...prev, familySize: n }))}
                        className={`flex-1 py-3 rounded-xl border ${data.familySize === n ? 'bg-[#00D4AA] text-[#0D1117]' : 'border-[#30363D] text-[#8B949E]'}`}
                      >
                        {n}{n === 6 ? '+' : ''}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-[#E6EDF3] block mb-3">Budget: {formatPrice(data.budget)}</label>
                  <input
                    type="range"
                    min={budgetRange[0]}
                    max={budgetRange[1]}
                    step={1000}
                    value={data.budget}
                    onChange={e => setData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                    className="w-full accent-[#00D4AA]"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-5">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#30363D] text-[#8B949E] text-sm">
                  <ChevronLeft size={16} /> Back
                </button>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-animate">
              <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8">
                <h2 className="font-display text-2xl font-bold text-[#E6EDF3] mb-6">Specific Needs</h2>
                <div className="flex flex-wrap gap-3">
                  {needsOptions.map(need => (
                    <button
                      key={need}
                      onClick={() => toggleNeed(need)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${data.needs.includes(need) ? 'bg-[#00D4AA]/20 border-[#00D4AA] text-[#00D4AA]' : 'border-[#30363D] text-[#8B949E]'}`}
                    >
                      {need}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-5">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#30363D] text-[#8B949E] text-sm">
                   <ChevronLeft size={16} /> Back
                </button>
                <button onClick={() => setStep(4)} className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm">
                  <Sparkles size={15} /> Find Appliances
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-animate bg-[#161B22] border border-[#30363D] rounded-3xl p-12 text-center">
              <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center bg-[#00D4AA] rounded-full">
                <Sparkles className="text-[#0D1117] animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-[#E6EDF3] mb-2">Analyzing Choices...</h2>
              <p className="text-[#00D4AA] text-sm mb-6">{thinkingMessages[thinkingMsg]}</p>
              <div className="h-1.5 bg-[#0D1117] rounded-full overflow-hidden max-w-xs mx-auto">
                <div className="h-full bg-[#00D4AA] transition-all" style={{ width: `${thinkingProgress}%` }} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="step-animate space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#E6EDF3]">Top Matches</h2>
                <p className="text-[#8B949E] mt-2">Showing up to 30 options for {selectedCategory?.name}</p>
              </div>

              {recommendations.map(({ product, score, reason }, index) => (
                <div key={product.id} className={`bg-[#161B22] border ${index === 0 ? 'border-[#00D4AA]' : 'border-[#30363D]'} rounded-3xl overflow-hidden`}>
                  <div className="p-6 flex flex-col sm:flex-row gap-6">
                    <img src={product.image} alt={product.name} className="w-24 h-24 rounded-xl object-cover bg-gray-800" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[#00D4AA] text-[10px] font-bold uppercase tracking-wider">{product.brand}</span>
                          <h3 className="text-[#E6EDF3] font-bold text-lg leading-tight">{product.name}</h3>
                        </div>
                        <div className="bg-[#0D1117] px-3 py-1 rounded-lg border border-[#30363D] text-center">
                          <span className="text-[#00D4AA] font-bold text-sm">{score}%</span>
                        </div>
                      </div>
                      <p className="text-[#8B949E] text-xs mt-3 italic"><span className="text-[#00D4AA]">Match Reason:</span> {reason}</p>
                      
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-xl font-bold text-[#E6EDF3]">{formatPrice(product.price)}</span>
                        <div className="flex gap-3">
                          <Link href={`/product/${product.id}`} className="text-[#8B949E] text-sm font-medium hover:text-[#E6EDF3]">View Specs</Link>
                          <a 
                            href={product.affiliateUrl || `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#00D4AA] text-[#0D1117] px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
                          >
                            Buy Now <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button onClick={reset} className="w-full py-4 border border-[#30363D] rounded-2xl text-[#8B949E] flex items-center justify-center gap-2 hover:bg-[#161B22]">
                <RotateCcw size={16} /> Try a different search
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
