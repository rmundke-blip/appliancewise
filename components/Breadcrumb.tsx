'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-[#00D4AA] hover:text-[#00D4AA]/80 font-medium mr-1"
      >
        <ArrowLeft size={15} />
        Back
      </button>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          <ChevronRight size={13} className="text-[#30363D]" />
          {crumb.href ? (
            <Link href={crumb.href} className="text-[#8B949E] hover:text-[#00D4AA] transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#E6EDF3] font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
