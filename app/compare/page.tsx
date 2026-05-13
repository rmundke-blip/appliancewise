'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Plus, Star, Zap, CircleCheck as CheckCircle, Circle as XCircle, Sparkles, GitCompare, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProductById, formatPrice, getProductPrimaryImage, type Product } from '@/lib/data';
import { getCompareIds, removeFromCompare, clearCompare } from '@/lib/compare-store';

const COMPARE_SPECS = [
  { key: 'price', label: 'Price', format: (p: Product) => formatPrice(p.price), isBest: (vals: Product[]) => vals.reduce((best, p) => p.price < best.price ? p : best, vals[0]) },
  { key: 'rating', label: 'Rating', format: (p: Product) => `${p.rating} ★`, isBest: (vals: Product[]) => vals.reduce((best, p) => p.rating > best.rating ? p : best, vals[0]) },
  { key: 'reviewCount', label: 'Reviews', format: (p: Product) => p.reviewCount.toLocaleString('en-IN'), isBest: (vals: Product[]) => vals.reduce((best, p) => p.reviewCount > best.reviewCount ? p : best, vals[0]) },
  { key: 'energyRating', label: 'Energy Rating', format: (p: Product) => p.energyRating || 'N/A', isBest: null },
  { key: 'discount', label: 'Discount', format: (p: Product) => `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}%`, isBest: (vals: Product[]) => vals.reduce((best, p) => ((p.mrp - p.price) / p.mrp) > ((best.mrp - best.price) / best.mrp) ? p : best, vals[0]) },
  { key: 'sentiment_positive', label: 'Positive Reviews', format: (p: Product) => `${p.sentiment.positive}%`, isBest: (vals: Product[]) => vals.reduce((best, p) => p.sentiment.positive > best.sentiment.positive ? p : best, vals[0]) },
];

function getAIVerdict(products: Product[]): string {
  if (products.length < 2) return '';
  const bestValue = products.reduce((best, p) => {
    const score = (p.rating * 20) + (p.sentiment.positive * 0.5) + (((p.mrp - p.price) / p.mrp) * 30);
    const bestScore = (best.rating * 20) + (best.sentiment.positive * 0.5) + (((best.mrp - best.price) / best.mrp) * 30);
    return score > bestScore ? p : best;
  }, products[0]);

  const reasons = [];
  if (bestValue.rating === Math.max(...products.map(p => p.rating))) reasons.push('highest rated');
  if (bestValue.sentiment.positive === Math.max(...products.map(p => p.sentiment.positive))) reasons.push('most positive reviews');
  if (bestValue.price === Math.min(...products.map(p => p.price))) reasons.push('best price');

  return `Based on rating, sentiment analysis, and value for money, ${bestValue.brand} ${bestValue.name.split(' ').slice(0, 3).join(' ')} is the best choice${reasons.length > 0 ? ' — it has ' + reasons.join(', ') : ''}. ${bestValue.sentiment.positive}% of users recommend it.`;
}

export default function ComparePage() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [showVerdict, setShowVerdict] = useState(false);
  const [verdict, setVerdict] = useState('');

  const loadProducts = () => {
    const ids = getCompareIds();
    const loaded = ids.map(id => getProductById(id)).filter(Boolean) as Product[];
    setCompareProducts(loaded);
  };

  useEffect(() => {
    loadProducts();
    const update = () => loadProducts();
    window.addEventListener('compare-updated', update);
    return () => window.removeEventListener('compare-updated', update);
  }, []);

  const handleRemove = (id: string) => {
    removeFromCompare(id);
    loadProducts();
    setShowVerdict(false);
  };

  const handleAIVerdict = () => {
    setVerdict(getAIVerdict(compareProducts));
    setShowVerdict(true);
  };

  if (compareProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        <Navbar />
        <main className="pt-20 min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-3xl bg-[#161B22] border border-[#30363D] flex items-center justify-center mx-auto mb-6">
              <GitCompare size={32} className="text-[#8B949E]" />
            </div>
            <h2 className="font-display text-3xl font-bold text-[#E6EDF3] mb-3">Nothing to Compare</h2>
            <p className="text-[#8B949E] mb-8 leading-relaxed">
              Add products to compare by clicking "Compare" on any product card. You can compare up to 3 products side by side.
            </p>
            <Link
              href="/category/tvs"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold text-sm hover:bg-[#00D4AA]/90 transition-colors"
            >
              <Plus size={16} />
              Browse Products to Compare
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mt-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#E6EDF3]">Compare Products</h1>
            <p className="text-[#8B949E] mt-1">
              {compareProducts.length} of 3 slots used
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleAIVerdict}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-semibold text-sm hover:bg-[#00D4AA]/90 transition-colors"
            >
              <Sparkles size={15} />
              Get AI Verdict
            </button>
            <button
              onClick={() => { clearCompare(); setShowVerdict(false); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#F85149]/40 text-[#F85149] text-sm hover:bg-[#F85149]/10 transition-colors"
            >
              <X size={14} />
              Clear All
            </button>
          </div>
        </div>

        {/* AI Verdict */}
        {showVerdict && verdict && (
          <div className="mb-8 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-[#00D4AA]" />
              </div>
              <div>
                <p className="text-[#00D4AA] font-semibold text-sm mb-2">AI Verdict</p>
                <p className="text-[#E6EDF3] text-sm leading-relaxed">{verdict}</p>
              </div>
              <button onClick={() => setShowVerdict(false)} className="text-[#8B949E] hover:text-[#E6EDF3] flex-shrink-0 ml-auto">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Product headers */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className={`grid gap-4 mb-6 ${compareProducts.length === 1 ? 'grid-cols-2' : compareProducts.length === 2 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {/* Empty label col */}
              <div className="hidden sm:block" />

              {/* Product cards */}
              {compareProducts.map(product => (
                <div key={product.id} className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
                  <div className="relative">
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[#0D1117]/80 flex items-center justify-center text-[#8B949E] hover:text-[#F85149] transition-colors"
                    >
                      <X size={13} />
                    </button>
                    <div className="h-36 bg-gradient-to-br from-[#1F2937] to-[#111827] overflow-hidden">
                      <img src={getProductPrimaryImage(product)} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[#00D4AA] text-xs font-semibold uppercase mb-1">{product.brand}</p>
                    <p className="text-[#E6EDF3] text-sm font-semibold line-clamp-2 mb-2 leading-snug">{product.name}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D]'} />
                      ))}
                      <span className="text-xs text-[#8B949E] ml-1">{product.rating}</span>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#00D4AA] text-[#0D1117] text-xs font-bold hover:bg-[#00D4AA]/90 transition-colors"
                    >
                      <ShoppingCart size={11} />
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))}

              {/* Add slot */}
              {compareProducts.length < 3 && (
                <Link
                  href="/category/tvs"
                  className="bg-[#161B22] border-2 border-dashed border-[#30363D] rounded-2xl flex flex-col items-center justify-center gap-2 p-6 min-h-[200px] hover:border-[#00D4AA]/50 hover:bg-[#00D4AA]/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center group-hover:bg-[#00D4AA]/20 transition-colors">
                    <Plus size={18} className="text-[#00D4AA]" />
                  </div>
                  <p className="text-[#8B949E] text-xs text-center group-hover:text-[#00D4AA] transition-colors">Add product to compare</p>
                </Link>
              )}
            </div>

            {/* Comparison table */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-[#30363D]">
                <h2 className="font-semibold text-[#E6EDF3] text-sm">Side-by-Side Comparison</h2>
              </div>

              {/* Key Metrics */}
              {COMPARE_SPECS.map((spec, idx) => {
                const bestProduct = spec.isBest ? spec.isBest(compareProducts) : null;

                return (
                  <div
                    key={spec.key}
                    className={`grid gap-4 px-4 py-4 border-b border-[#30363D] last:border-b-0 ${
                      idx % 2 === 0 ? 'bg-[#0D1117]/30' : ''
                    } ${compareProducts.length === 1 ? 'grid-cols-2' : compareProducts.length === 2 ? 'grid-cols-3' : 'grid-cols-4'}`}
                  >
                    <div className="text-sm text-[#8B949E] font-medium flex items-center">{spec.label}</div>
                    {compareProducts.map(product => {
                      const isBest = bestProduct?.id === product.id && spec.isBest;
                      return (
                        <div
                          key={product.id}
                          className={`text-sm font-semibold flex items-center gap-1.5 ${
                            isBest ? 'text-[#00D4AA]' : 'text-[#E6EDF3]'
                          }`}
                        >
                          {isBest && <Zap size={12} fill="currentColor" className="flex-shrink-0" />}
                          {spec.format(product)}
                        </div>
                      );
                    })}
                    {compareProducts.length < 3 && <div />}
                  </div>
                );
              })}

              {/* Specs from actual product specs */}
              <div className="p-4 border-t border-[#30363D] border-b">
                <p className="text-sm font-semibold text-[#E6EDF3]">Detailed Specifications</p>
              </div>
              {(() => {
                const allKeys = Array.from(new Set(compareProducts.flatMap(p => Object.keys(p.specs))));
                return allKeys.map((key, idx) => (
                  <div
                    key={key}
                    className={`grid gap-4 px-4 py-3.5 border-b border-[#30363D] last:border-b-0 ${
                      idx % 2 === 0 ? 'bg-[#0D1117]/30' : ''
                    } ${compareProducts.length === 1 ? 'grid-cols-2' : compareProducts.length === 2 ? 'grid-cols-3' : 'grid-cols-4'}`}
                  >
                    <div className="text-xs text-[#8B949E] font-medium flex items-center">{key}</div>
                    {compareProducts.map(product => (
                      <div key={product.id} className="text-xs text-[#E6EDF3]">
                        {product.specs[key] || <span className="text-[#30363D]">—</span>}
                      </div>
                    ))}
                    {compareProducts.length < 3 && <div />}
                  </div>
                ));
              })()}

              {/* Highlights */}
              <div className="p-4 border-t border-[#30363D] border-b">
                <p className="text-sm font-semibold text-[#E6EDF3]">Key Highlights</p>
              </div>
              <div className={`grid gap-4 px-4 py-4 ${compareProducts.length === 1 ? 'grid-cols-2' : compareProducts.length === 2 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                <div />
                {compareProducts.map(product => (
                  <div key={product.id} className="space-y-2">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <CheckCircle size={11} className="text-[#3FB950] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-[#8B949E] leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                ))}
                {compareProducts.length < 3 && <div />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
