import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/data';

export default function SearchPage({ searchParams }: { searchParams?: { q?: string } }) {
  const query = searchParams?.q?.trim() ?? '';
  const normalizedQuery = query.toLowerCase();

  const searchResults = query
    ? products.filter(product =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.brand.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.categorySlug.toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-[#00D4AA] text-sm font-semibold uppercase tracking-wider mb-2">Search Results</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#E6EDF3] mb-3">{query ? `Results for “${query}”` : 'Search appliances'}</h1>
          <p className="text-[#8B949E] text-sm sm:text-base max-w-3xl">
            {query
              ? `${searchResults.length} product${searchResults.length === 1 ? '' : 's'} found across all categories.`
              : 'Enter a product name or category in the homepage search bar to find matching appliances.'}
          </p>
        </div>

        {query && searchResults.length === 0 ? (
          <div className="rounded-3xl border border-[#30363D] bg-[#161B22] p-10 text-center">
            <p className="text-[#8B949E] text-lg mb-4">No products matched your search query.</p>
            <p className="text-[#6E7681] text-sm">Try a different name, brand, or category like TV, AC, refrigerator, or washing machine.</p>
          </div>
        ) : null}

        {query && searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
