'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star, GitCompare, ExternalLink, ShoppingCart } from 'lucide-react';
import { type Product, formatPrice, getDiscount, getProductPrimaryImage } from '@/lib/data';
import { addToCompare, removeFromCompare, isInCompare } from '@/lib/compare-store';

type Props = {
  product: Product;
  showCompare?: boolean;
  compact?: boolean;
};

export default function ProductCard({ product, showCompare = true, compact = false }: Props) {
  const [inCompare, setInCompare] = useState(false);
  const [compareMsg, setCompareMsg] = useState('');
  const discount = getDiscount(product.price, product.mrp);
  const imageSrc = getProductPrimaryImage(product);

  useEffect(() => {
    setInCompare(isInCompare(product.id));
    const update = () => setInCompare(isInCompare(product.id));
    window.addEventListener('compare-updated', update);
    return () => window.removeEventListener('compare-updated', update);
  }, [product.id]);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product.id);
      setInCompare(false);
    } else {
      const added = addToCompare(product.id);
      if (!added) {
        setCompareMsg('Max 4 products');
        setTimeout(() => setCompareMsg(''), 2000);
      } else {
        setInCompare(true);
      }
    }
  };

  return (
    <div className="group relative bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden card-glow flex flex-col">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {product.badge && (
          <span className="px-2.5 py-1 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] text-xs font-semibold border border-[#00D4AA]/30">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-[#3FB950]/15 text-[#3FB950] text-xs font-semibold border border-[#3FB950]/30">
            -{discount}%
          </span>
        )}
      </div>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className={`relative overflow-hidden bg-gradient-to-br from-[#1F2937] to-[#111827] flex items-center justify-center ${compact ? 'h-40' : 'h-52'}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://placehold.co/400x300/1F2937/00D4AA?text=${encodeURIComponent(product.brand)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161B22]/30 to-transparent" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-xs text-[#00D4AA] font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
          <Link href={`/product/${product.id}`} className="hover:text-[#00D4AA] transition-colors">
            <h3 className={`font-semibold text-[#E6EDF3] leading-snug ${compact ? 'text-sm line-clamp-2' : 'text-base line-clamp-2'}`}>
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'text-[#FFB020] fill-[#FFB020]' : 'text-[#30363D] fill-[#30363D]'}
              />
            ))}
          </div>
          <span className="text-xs text-[#E6EDF3] font-medium">{product.rating}</span>
          <span className="text-xs text-[#8B949E]">({product.reviewCount.toLocaleString('en-IN')})</span>
        </div>

        {/* Energy rating */}
        {product.energyRating && (
          <span className="text-xs text-[#8B949E]">
            ⚡ {product.energyRating} BEE Rated
          </span>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className={`font-bold text-[#E6EDF3] ${compact ? 'text-base' : 'text-xl'}`}>
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-[#8B949E] line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#00D4AA] text-[#0D1117] text-sm font-semibold hover:bg-[#00D4AA]/90 transition-colors"
          >
            <ShoppingCart size={13} />
            Buy Now
          </Link>

          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[#8B949E] text-xs font-medium hover:text-[#00D4AA] border border-[#30363D] hover:border-[#00D4AA]/40 transition-colors"
            title="View full product details"
          >
            <ExternalLink size={11} />
            Details
          </Link>

          {showCompare && (
            <button
              onClick={handleCompare}
              title={compareMsg || (inCompare ? 'Remove from compare' : 'Add to compare')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                inCompare
                  ? 'bg-[#00D4AA]/15 text-[#00D4AA] border-[#00D4AA]/40'
                  : 'bg-transparent text-[#8B949E] border-[#30363D] hover:text-[#00D4AA] hover:border-[#00D4AA]/40'
              }`}
            >
              <GitCompare size={13} />
              {compareMsg || (inCompare ? 'Added' : 'Compare')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
