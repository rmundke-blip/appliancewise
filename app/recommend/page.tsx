The error in your screenshot is mainly because of malformed JSX parsing in the deployed file.
Most likely causes:

* Hidden invalid characters while copy/paste
* Corrupted JSX near:

return (
  <div className="min-h-screen bg-[#0D1117]">

* Or TypeScript parser issue with complex inline types/import aliases.

Below is a cleaned and safer version of your page structure that should compile correctly in Next.js App Router.

Replace your entire file with this version exactly.

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
type WizardData = {
  category: string;
  familySize: number;
  budget: number;
  needs: string[];
};
type Recommendation = {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  score: number;
  reason: string;
};
const categories = [
  { slug: 'tvs', name: 'TVs', emoji: '📺' },
  { slug: 'refrigerators', name: 'Refrigerators', emoji: '🧊' },
  { slug: 'air-conditioners', name: 'AC', emoji: '❄️' },
  { slug: 'washing-machines', name: 'Washing Machines', emoji: '🧺' },
];
const NEEDS = [
  'Energy Saving',
  'Large Family',
  'Gaming',
  'Budget Friendly',
  'Low Maintenance',
];
export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    category: '',
    familySize: 4,
    budget: 50000,
    needs: [],
  });
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);
  useEffect(() => {
    if (step !== 4) return;
    setThinkingProgress(0);
    const interval = setInterval(() => {
      setThinkingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setRecommendations([
            {
              id: 1,
              name: 'Samsung Smart TV',
              brand: 'Samsung',
              price: 45999,
              image:
                'https://via.placeholder.com/150',
              score: 95,
              reason: 'Perfect budget match',
            },
            {
              id: 2,
              name: 'LG Refrigerator',
              brand: 'LG',
              price: 38999,
              image:
                'https://via.placeholder.com/150',
              score: 91,
              reason: 'Energy efficient',
            },
          ]);
          setTimeout(() => {
            setStep(5);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [step]);
  const toggleNeed = (need: string) => {
    setData((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }));
  };
  const reset = () => {
    setStep(1);
    setData({
      category: '',
      familySize: 4,
      budget: 50000,
      needs: [],
    });
    setRecommendations([]);
  };
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />
      <main className="pt-20 pb-16 px-4 sm:px-6 min-h-screen">
        <div className="max-w-3xl mx-auto text-center mt-10 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-sm font-medium mb-5">
            <Sparkles size={14} />
            Smart Appliance Selection
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Find Your Perfect Match
          </h1>
          <p className="text-gray-400">
            Personalized appliance recommendations.
          </p>
        </div>
        {step < 5 && (
          <div className="max-w-2xl mx-auto mb-10">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00D4AA]"
                style={{
                  width: `${(step / 4) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <div className="bg-[#161B22] border border-gray-700 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Select Category
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() =>
                      setData((prev) => ({
                        ...prev,
                        category: cat.slug,
                      }))
                    }
                    className={`p-5 rounded-2xl border ${
                      data.category === cat.slug
                        ? 'border-[#00D4AA] bg-[#00D4AA]/10'
                        : 'border-gray-700'
                    }`}
                  >
                    <div className="text-3xl mb-2">
                      {cat.emoji}
                    </div>
                    <div className="text-white text-sm">
                      {cat.name}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.category}
                  className="bg-[#00D4AA] text-black px-6 py-3 rounded-xl font-bold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="bg-[#161B22] border border-gray-700 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Home Requirements
              </h2>
              <label className="text-white block mb-3">
                Family Size: {data.familySize}
              </label>
              <input
                type="range"
                min={1}
                max={6}
                value={data.familySize}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    familySize: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="border border-gray-700 px-5 py-3 rounded-xl text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-[#00D4AA] text-black px-6 py-3 rounded-xl font-bold"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="bg-[#161B22] border border-gray-700 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Select Needs
              </h2>
              <div className="flex flex-wrap gap-3">
                {NEEDS.map((need) => (
                  <button
                    key={need}
                    onClick={() => toggleNeed(need)}
                    className={`px-4 py-2 rounded-full border ${
                      data.needs.includes(need)
                        ? 'bg-[#00D4AA]/20 border-[#00D4AA] text-[#00D4AA]'
                        : 'border-gray-700 text-gray-300'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="border border-gray-700 px-5 py-3 rounded-xl text-white"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="bg-[#00D4AA] text-black px-6 py-3 rounded-xl font-bold"
                >
                  Find Appliances
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="bg-[#161B22] border border-gray-700 rounded-3xl p-12 text-center">
              <Sparkles className="mx-auto text-[#00D4AA] mb-4 animate-pulse" />
              <h2 className="text-white text-2xl font-bold mb-4">
                Analyzing...
              </h2>
              <div className="h-2 bg-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00D4AA]"
                  style={{
                    width: `${thinkingProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-6">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#161B22] border border-gray-700 rounded-3xl p-6"
                >
                  <div className="flex gap-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-[#00D4AA] text-sm">
                            {item.brand}
                          </p>
                          <h3 className="text-white font-bold text-lg">
                            {item.name}
                          </h3>
                        </div>
                        <div className="text-[#00D4AA] font-bold">
                          {item.score}%
                        </div>
                      </div>
                      <p className="text-gray-400 mt-2">
                        {item.reason}
                      </p>
                      <div className="flex justify-between items-center mt-5">
                        <div className="text-white text-xl font-bold">
                          ₹{item.price.toLocaleString()}
                        </div>
                        <div className="flex gap-3">
                          <Link
                            href="/"
                            className="text-gray-300"
                          >
                            View
                          </Link>
                          <a
                            href="https://amazon.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#00D4AA] text-black px-4 py-2 rounded-xl flex items-center gap-2 font-bold"
                          >
                            Buy
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={reset}
                className="w-full border border-gray-700 py-4 rounded-2xl text-white flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                Start Again
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}