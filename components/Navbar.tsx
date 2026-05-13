'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, X, Menu, Zap, GitCompare } from 'lucide-react';
import { getCompareIds } from '@/lib/compare-store';
import { products, getProductPrimaryImage } from '@/lib/data';

export default function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setCompareCount(getCompareIds().length);
    update();
    window.addEventListener('compare-updated', update);
    return () => window.removeEventListener('compare-updated', update);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchResults = searchQuery.length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/category/tvs', label: 'Appliances' },
    { href: '/recommend', label: 'AI Recommend' },
    { href: '/compare', label: 'Compare' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 bg-[#00D4AA] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap size={18} className="text-[#0D1117]" fill="currentColor" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight hidden sm:block">
              Appliance<span className="text-[#00D4AA]">Wise</span>
            </span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === link.href || pathname.startsWith(link.href.split('/')[1] === '' ? '/x' : '/' + link.href.split('/')[1])
                    ? 'bg-[#00D4AA]/15 text-[#00D4AA]'
                    : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {compareCount > 0 && (
              <Link
                href="/compare"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00D4AA]/15 text-[#00D4AA] text-sm font-medium hover:bg-[#00D4AA]/25 transition-colors"
              >
                <GitCompare size={14} />
                <span>{compareCount} items</span>
              </Link>
            )}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#8B949E] hover:text-[#E6EDF3] hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#8B949E] hover:text-[#E6EDF3] hover:bg-white/5 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#161B22] border-t border-[#30363D] px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#E6EDF3] hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search appliances, brands..."
                className="w-full bg-[#161B22] border border-[#30363D] rounded-2xl pl-11 pr-12 py-4 text-[#E6EDF3] placeholder:text-[#8B949E] text-base focus:outline-none focus:border-[#00D4AA] transition-colors"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-[#E6EDF3]"
              >
                <X size={18} />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden">
                {searchResults.map((product, i) => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${i < searchResults.length - 1 ? 'border-b border-[#30363D]' : ''}`}
                  >
                    <Link
                      href={`/product/${product.id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#0D1117] overflow-hidden flex-shrink-0">
                        <img src={getProductPrimaryImage(product)} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#E6EDF3] truncate">{product.brand} {product.name}</p>
                        <p className="text-xs text-[#8B949E]">{product.category} · ₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                    <Link
                      href={`/product/${product.id}`}
                      className="px-2.5 py-1 rounded-lg bg-[#00D4AA]/15 text-[#00D4AA] text-xs font-semibold hover:bg-[#00D4AA]/25 transition-colors flex-shrink-0 whitespace-nowrap"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    >
                      Buy
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length > 1 && searchResults.length === 0 && (
              <div className="mt-2 bg-[#161B22] border border-[#30363D] rounded-2xl px-4 py-6 text-center text-[#8B949E] text-sm">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
