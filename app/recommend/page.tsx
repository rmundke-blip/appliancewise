'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== 2) return;

    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <>
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <main className="pt-20 pb-16 px-4">
          <div className="max-w-3xl mx-auto text-center mt-10">
            <h1 className="text-4xl font-bold mb-4">
              Appliance Wise
            </h1>

            <p className="text-gray-400 mb-10">
              Smart appliance recommendations for your home
            </p>

            {step === 1 && (
              <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Recommendation Wizard
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <button className="border border-gray-700 rounded-2xl p-5 hover:bg-gray-800">
                    📺 TVs
                  </button>

                  <button className="border border-gray-700 rounded-2xl p-5 hover:bg-gray-800">
                    ❄️ AC
                  </button>

                  <button className="border border-gray-700 rounded-2xl p-5 hover:bg-gray-800">
                    🧊 Refrigerators
                  </button>

                  <button className="border border-gray-700 rounded-2xl p-5 hover:bg-gray-800">
                    🧺 Washing Machines
                  </button>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="mt-8 bg-green-400 text-black px-8 py-3 rounded-xl font-bold"
                >
                  Find Recommendations
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-4">
                  Analyzing Products
                </h2>

                <p className="text-gray-400 mb-6">
                  Checking ratings, reviews and pricing...
                </p>

                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-green-400 rounded-full"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-green-400">
                  {progress}% Complete
                </p>

                {progress === 100 && (
                  <div className="mt-10 text-left">
                    <div className="border border-gray-700 rounded-2xl p-5 mb-4">
                      <h3 className="text-xl font-bold">
                        Samsung Smart TV
                      </h3>

                      <p className="text-gray-400 mt-2">
                        Best for budget and performance
                      </p>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-2xl font-bold">
                          ₹45,999
                        </span>

                        <Link
                          href="/"
                          className="bg-green-400 text-black px-5 py-2 rounded-lg font-bold"
                        >
                          View
                        </Link>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setStep(1);
                        setProgress(0);
                      }}
                      className="w-full border border-gray-700 rounded-xl py-3"
                    >
                      Start Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}