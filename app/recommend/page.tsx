'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== 2) return;

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
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        Appliance Wise
      </h1>

      {step === 1 && (
        <div>
          <p className="mb-5">Recommendation Wizard</p>

          <button
            onClick={() => setStep(2)}
            className="bg-green-400 text-black px-6 py-3 rounded"
          >
            Start
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-5">
            Analyzing... {progress}%
          </p>

          <div className="w-full h-3 bg-gray-700 rounded">
            <div
              className="h-3 bg-green-400 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="underline"
            >
              Go Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}