"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("https://uqies.com");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="bg-[#00113a] p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white">Welcome to UQIES 🚀</h1>
        <p className="text-lg mt-4 text-white">
          You&apos;re now a member of Australia&apos;s largest innovation and entrepreneurship society
        </p>
        <p className="text-sm mt-2 text-gray-300">
          Check out our upcoming events in 5 seconds...
        </p>
      </div>
    </div>
  );
}
