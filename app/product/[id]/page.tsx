'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, ShoppingCart, GitCompare, Zap, Shield, X, ChevronLeft, ChevronRight, ExternalLink, ThumbsUp, ThumbsDown, CircleCheck as CheckCircle, TrendingDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProductById, formatPrice, getDiscount, type Product } from '@/lib/data';
import { addToCompare, removeFromCompare, isInCompare } from '@/lib/compare-store';
import Breadcrumb from '@/components/Breadcrumb';

const storeLogos: Record<string, string> = {
  Flipkart: '🛒',
  Amazon: '📦',
  Croma: '🏪',
  'Reliance Digital': '💻',
};

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews' | 'compare'>('overview');
  const [activeImage, setActiveImage] = useState(0);
  const [inCompare, setInCompare] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [compareMsg, setCompareMsg] = useState('');

  useEffect(() => {
    const p = getProductById(id);
    setProduct(p || null);
    if (p) setInCompare(isInCompare(p.id));
  }, [id]);

  useEffect(() => {
    const update = () => product && setInCompare(isInCompare(product.id));
    window.addEventListener('compare-updated', update);
    return () => window.removeEventListener('compare-updated', update);
  }, [product]);

  const handleCompare = () => {
    if (!product) return;
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      const added = addToCompare(product.id);
      if (!added) {
        setCompareMsg('Max 3 products in compare. Remove one first.');
        setTimeout(() => setCompareMsg(''), 3000);
        return;
      }
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-[#8B949E] text-lg">Product not found</p>
            <Link href="/" className="text-[#00D4AA] mt-4 inline-block hover:underline">Go home</Link>
          </div>
        </div>
      </div>
    );
  }

  const positiveReviews = product.reviews.filter(r => r.sentiment === 'positive');
  const negativeReviews = product.reviews.filter(r => r.sentiment === 'negative');
  const discount = getDiscount(product.price, product.mrp);
  const lowestPrice = Math.min(...product.prices.map(p => p.price));

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews (' + product.reviewCount.toLocaleString('en-IN') + ')' },
    { id: 'compare', label: 'Compare' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-3 mb-8 mt-4">
          <Link
            href={'/category/' + product.categorySlug}
            className="flex items-center gap-1.5 text-sm text-[#8B949E] hover:text-[#00D4AA] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to {product.category}
          </Link>
          <ChevronRight size={14} className="text-[#30363D]" />
          <span className="text-sm text-[#8B949E] truncate">{product.brand} {product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          <div>
            <div className="relative bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/600x400/1F2937/00D4AA?text=' + encodeURIComponent(product.brand);
                }}
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage(i => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {product.badge && (
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#00D4AA] text-[#0D1117] text-xs font-bold">
                  {product.badge}
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={'w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ' + (activeImage === i ? 'border-[#00D4AA]' : 'border-[#30363D]')}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/64x48/1F2937/00D4AA?text=' + encodeURIComponent(product.brand);
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-[#00D4AA] font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#E6EDF3] leading-tight mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D] fill-[#30363D]'} />
                  ))}
                </div>
                <span className="text-[#E6EDF3] font-semibold">{product.rating}</span>
                <span className="text-[#8B949E] text-sm">({product.reviewCount.toLocaleString('en-IN')} reviews)</span>
                {product.energyRating && (
                  <span className="flex items-center gap-1 text-xs bg-[#3FB950]/15 text-[#3FB950] border border-[#3FB950]/30 rounded-full px-2.5 py-1">
                    <Zap size={11} fill="currentColor" />
                    {product.energyRating}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-[#E6EDF3]">{formatPrice(product.price)}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-[#8B949E] text-base line-through">{formatPrice(product.mrp)}</span>
                    <span className="text-sm font-semibold text-[#3FB950] bg-[#3FB950]/15 border border-[#3FB950]/30 rounded-full px-2.5 py-0.5">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#8B949E] flex items-center gap-1.5">
                <TrendingDown size={12} className="text-[#3FB950]" />
                Lowest price found: {formatPrice(lowestPrice)} on {product.prices.find(p => p.price === lowestPrice)?.store}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#E6EDF3] mb-3">Key Highlights</p>
              <ul className="space-y-2">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#8B949E]">
                    <CheckCircle size={14} className="text-[#00D4AA] mt-0.5 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={product.prices[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00D4AA] text-[#0D1117] font-bold hover:bg-[#00D4AA]/90 transition-colors"
              >
                <ShoppingCart size={16} />
                Buy on {product.prices[0].store}
              </a>
              <button
                onClick={handleCompare}
                className={'flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border font-semibold text-sm transition-all ' + (inCompare ? 'bg-[#00D4AA]/15 text-[#00D4AA] border-[#00D4AA]/40' : 'bg-transparent text-[#8B949E] border-[#30363D] hover:text-[#00D4AA] hover:border-[#00D4AA]/40')}
              >
                <GitCompare size={16} />
                {inCompare ? 'Added to Compare' : 'Add to Compare'}
              </button>
            </div>
            {compareMsg && <p className="text-xs text-[#F85149] bg-[#F85149]/10 rounded-lg px-3 py-2">{compareMsg}</p>}

            <div className="flex gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                <Shield size={13} className="text-[#00D4AA]" />
                Warranty included
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                <CheckCircle size={13} className="text-[#00D4AA]" />
                Verified reviews
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-semibold text-[#E6EDF3] mb-4">Price Comparison</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {product.prices.map(p => {
              const isLowest = p.price === lowestPrice;
              return (
                <a
                  key={p.store}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={'relative bg-[#161B22] border rounded-2xl p-4 hover:scale-[1.02] transition-all ' + (isLowest ? 'border-[#00D4AA]/60' : 'border-[#30363D]')}
                >
                  {isLowest && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#00D4AA] text-[#0D1117] text-[10px] font-bold whitespace-nowrap">
                      BEST PRICE
                    </div>
                  )}
                  <div className="text-2xl mb-2 text-center">{storeLogos[p.store]}</div>
                  <p className="text-[#E6EDF3] font-semibold text-center text-sm mb-0.5">{p.store}</p>
                  <p className={'text-center font-bold text-lg ' + (isLowest ? 'text-[#00D4AA]' : 'text-[#E6EDF3]')}>
                    {formatPrice(p.price)}
                  </p>
                  <p className="text-[#8B949E] text-xs text-center mt-1">{p.delivery}</p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[#00D4AA] font-medium">
                    <ExternalLink size={11} />
                    View Deal
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex gap-1 bg-[#161B22] border border-[#30363D] rounded-2xl p-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={'flex-1 py-2.5 px-4 rounded-xl text-sm font-medium whitespace-nowrap transition-all ' + (activeTab === tab.id ? 'bg-[#00D4AA] text-[#0D1117]' : 'text-[#8B949E] hover:text-[#E6EDF3]')}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#E6EDF3] mb-4 text-lg">About This Product</h3>
                  <ul className="space-y-3">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#8B949E] text-sm">
                        <div className="w-6 h-6 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#00D4AA] text-xs font-bold">{i + 1}</span>
                        </div>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#E6EDF3] mb-4">Quick Specs</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(product.specs).slice(0, 6).map(([key, val]) => (
                      <div key={key} className="bg-[#0D1117] rounded-xl p-3">
                        <p className="text-[#8B949E] text-xs mb-1">{key}</p>
                        <p className="text-[#E6EDF3] text-sm font-medium">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-[#30363D]">
                  <h3 className="font-semibold text-[#E6EDF3]">Full Specifications</h3>
                </div>
                <div className="divide-y divide-[#30363D]">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <span className="text-[#8B949E] text-sm w-1/2 flex-shrink-0">{key}</span>
                      <span className="text-[#E6EDF3] text-sm font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#E6EDF3] mb-5">Consumer Sentiment</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Positive', value: product.sentiment.positive, color: '#3FB950', emoji: '😊', barBg: 'bg-[#3FB950]' },
                      { label: 'Neutral', value: product.sentiment.neutral, color: '#FFB020', emoji: '😐', barBg: 'bg-[#FFB020]' },
                      { label: 'Negative', value: product.sentiment.negative, color: '#F85149', emoji: '😢', barBg: 'bg-[#F85149]' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-4">
                        <span className="text-xl w-6 text-center">{item.emoji}</span>
                        <span className="text-[#8B949E] text-sm w-16 flex-shrink-0">{item.label}</span>
                        <div className="flex-1 bg-[#0D1117] rounded-full h-2.5 overflow-hidden">
                          <div
                            className={'h-full rounded-full ' + item.barBg + ' transition-all duration-1000'}
                            style={{ width: item.value + '%' }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-10 text-right" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-[#E6EDF3] mb-4">
                    <ThumbsUp size={16} className="text-[#3FB950]" />
                    Top Positive Reviews
                  </h3>
                  <div className="space-y-3">
                    {positiveReviews.slice(0, 3).map(review => (
                      <div key={review.id} className="bg-[#161B22] border-l-2 border-[#3FB950] border border-[#30363D] rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <p className="font-semibold text-[#E6EDF3] text-sm">{review.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={11} className={i < review.rating ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D]'} />
                                ))}
                              </div>
                              {review.verified && (
                                <span className="text-xs text-[#3FB950] flex items-center gap-1">
                                  <CheckCircle size={10} />
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-[#8B949E] flex-shrink-0">{review.date}</span>
                        </div>
                        <p className="text-[#8B949E] text-sm leading-relaxed">{review.body}</p>
                        <p className="text-xs text-[#8B949E] mt-2 font-medium">{review.author}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {negativeReviews.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-[#E6EDF3] mb-4">
                      <ThumbsDown size={16} className="text-[#F85149]" />
                      Critical Reviews
                    </h3>
                    <div className="space-y-3">
                      {negativeReviews.slice(0, 3).map(review => (
                        <div key={review.id} className="bg-[#161B22] border-l-2 border-[#F85149] border border-[#30363D] rounded-2xl p-5">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="font-semibold text-[#E6EDF3] text-sm">{review.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={11} className={i < review.rating ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D]'} />
                                  ))}
                                </div>
                                {review.verified && (
                                  <span className="text-xs text-[#3FB950] flex items-center gap-1">
                                    <CheckCircle size={10} />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-[#8B949E] flex-shrink-0">{review.date}</span>
                          </div>
                          <p className="text-[#8B949E] text-sm leading-relaxed">{review.body}</p>
                          <p className="text-xs text-[#8B949E] mt-2 font-medium">{review.author}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowAllReviews(true)}
                  className="w-full py-3.5 rounded-xl border border-[#30363D] text-[#8B949E] hover:text-[#00D4AA] hover:border-[#00D4AA]/40 transition-colors text-sm font-medium"
                >
                  View All {product.reviewCount.toLocaleString('en-IN')} Reviews
                </button>
              </div>
            )}

            {activeTab === 'compare' && (
              <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8 text-center">
                <GitCompare size={40} className="text-[#00D4AA] mx-auto mb-4" />
                <h3 className="font-semibold text-[#E6EDF3] text-xl mb-2">Compare This Product</h3>
                <p className="text-[#8B949E] text-sm mb-6 max-w-sm mx-auto">
                  Add this product to compare and find the best option side by side with other appliances.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleCompare}
                    className={'flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ' + (inCompare ? 'bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/40' : 'bg-[#00D4AA] text-[#0D1117] hover:bg-[#00D4AA]/90')}
                  >
                    <GitCompare size={16} />
                    {inCompare ? 'Added to Compare' : 'Add to Compare'}
                  </button>
                  <Link
                    href="/compare"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#30363D] text-[#8B949E] hover:text-[#00D4AA] hover:border-[#00D4AA]/40 transition-colors text-sm font-medium"
                  >
                    Open Compare Page
                  </Link>
                </div>
                {compareMsg && <p className="text-xs text-[#F85149] mt-3">{compareMsg}</p>}
              </div>
            )}

          </div>
        </div>
      </main>

      {showAllReviews && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setShowAllReviews(false)}
        >
          <div className="bg-[#161B22] border border-[#30363D] rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#30363D]">
              <div>
                <h3 className="font-semibold text-[#E6EDF3] text-lg">All Reviews</h3>
                <p className="text-sm text-[#8B949E]">{product.name}</p>
              </div>
              <button
                onClick={() => setShowAllReviews(false)}
                className="w-9 h-9 rounded-full bg-[#0D1117] flex items-center justify-center text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              {product.reviews.map(review => (
                <div
                  key={review.id}
                  className={'border rounded-xl p-4 ' + (review.sentiment === 'positive' ? 'border-l-2 border-l-[#3FB950] border-[#30363D]' : review.sentiment === 'negative' ? 'border-l-2 border-l-[#F85149] border-[#30363D]' : 'border-[#30363D]')}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-[#E6EDF3] text-sm">{review.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className={i < review.rating ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D]'} />
                          ))}
                        </div>
                        <span className="text-xs text-[#8B949E]">{review.author}</span>
                        {review.verified && (
                          <span className="text-xs text-[#3FB950] flex items-center gap-1">
                            <CheckCircle size={10} />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-[#8B949E] flex-shrink-0">{review.date}</span>
                  </div>
                  <p className="text-[#8B949E] text-sm leading-relaxed">{review.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
