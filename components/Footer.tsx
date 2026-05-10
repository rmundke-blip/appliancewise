import Link from 'next/link';
import { Zap, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

const footerLinks = {
  'Categories': [
    { label: 'TVs', href: '/category/tvs' },
    { label: 'Refrigerators', href: '/category/refrigerators' },
    { label: 'Air Conditioners', href: '/category/air-conditioners' },
    { label: 'Washing Machines', href: '/category/washing-machines' },
    { label: 'Water Purifiers', href: '/category/water-purifiers' },
  ],
  'Tools': [
    { label: 'AI Recommend', href: '/recommend' },
    { label: 'Compare Products', href: '/compare' },
    { label: 'Price Tracker', href: '#' },
    { label: 'Energy Calculator', href: '#' },
  ],
  'Company': [
    { label: 'About Us', href: '#' },
    { label: 'How We Review', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#30363D] bg-[#0D1117] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-[#00D4AA] rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-[#0D1117]" fill="currentColor" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Appliance<span className="text-[#00D4AA]">Wise</span>
              </span>
            </Link>
            <p className="text-[#8B949E] text-sm leading-relaxed mb-5">
              India's most trusted appliance buying guide. Expert reviews, price comparisons, and AI-powered recommendations for smarter purchases.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Youtube, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#8B949E] hover:text-[#00D4AA] hover:border-[#00D4AA]/50 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[#E6EDF3] font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[#8B949E] text-sm hover:text-[#00D4AA] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#8B949E] text-sm">
            &copy; 2024 ApplianceWise. All rights reserved.
          </p>
          <p className="text-[#8B949E] text-sm">
            Made with <span className="text-[#F85149]">❤️</span> in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
