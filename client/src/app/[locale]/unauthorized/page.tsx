"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { useTranslations } from "next-intl";
export default function Unauthorized() {
  const t = useTranslations('Unauthorized')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {loading ? (
            <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
        ) : (
          <div className="shadow-2xl rounded-lg p-8 max-w-lg w-full bg-gray-100 border border-gray-400 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">{t('Title')}</h1>
            <p className="text-gray-700 mb-6">
              {t('para')} <strong>{t('highlight')}</strong>.
            </p>
            <Link href="/">
              <span className="inline-block bg-blue-400 text-white px-5 py-2 rounded hover:bg-blue-600 transition">
                {t('button')}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
