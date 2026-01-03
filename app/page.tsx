"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useWeavingStore } from "@/lib/store/useWeavingStore";

export default function Home() {
  const { initializePattern } = useWeavingStore();

  useEffect(() => {
    // Initialize pattern on first load
    initializePattern();
  }, [initializePattern]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Basket Weaving Pattern Design
        </h1>
        <p className="text-center text-lg mb-8 text-gray-600 dark:text-gray-400">
          Design and follow basket weaving patterns step by step
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/design"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Start Designing
          </Link>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Workflow:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Design your pattern</li>
              <li>Confirm the pattern</li>
              <li>Follow step-by-step weaving instructions</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
