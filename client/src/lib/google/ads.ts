// src/lib/google/ads.ts
import { env } from "@/lib/env"

const AD_ID = process.env.NEXT_PUBLIC_GA_ADS_CONVERSION_ID;

export interface TrackConversionOptions {
  event?: string;
  form_id?: string;
  form_name?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}

interface GtagEvent {
  send_to: string;
  form_id?: string;
  form_name?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}

// Global declarations
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

const validateConfig = (): boolean => {
  if (!AD_ID) {
    console.error('❌ Google Ads ID missing. Set NEXT_PUBLIC_GA_ADS_CONVERSION_ID in .env.');
    return false;
  }

  return true;
};

const isClient = () => typeof window !== 'undefined';

const isGtagReady = (): boolean =>
  isClient() && typeof window.gtag === 'function' && Array.isArray(window.dataLayer);

const loadGoogleAdsScript = (): Promise<void> => {
  if (!isClient()) return Promise.reject(new Error('SSR: window is not available'));

  if (isInitialized) return Promise.resolve();

  if (initializationPromise) return initializationPromise;

  initializationPromise = new Promise((resolve, reject) => {
    if (!validateConfig()) {
      reject(new Error('Missing Google Ads configuration'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${AD_ID}`;
    script.async = true;

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        window.dataLayer!.push(...args);
      };

      window.gtag('js', new Date());
      window.gtag('config', AD_ID!, { send_page_view: false });

      isInitialized = true;
      resolve();
    };

    script.onerror = () => reject(new Error('Failed to load gtag.js'));

    document.head.appendChild(script);
  });

  return initializationPromise;
};

export const trackConversion = async (conversionLabel: string, options: TrackConversionOptions = {}) => {
  if (!isClient()) {
    console.warn('Conversion tracking attempted on server.');
    return;
  }

  try {
    await loadGoogleAdsScript();

    const event: GtagEvent = {
      send_to: `${AD_ID}/${conversionLabel}`,
      ...options,
    };

    if (!isGtagReady()) {
      console.warn('gtag not ready yet.');
      return;
    }

    window.gtag('event', 'conversion', event);
    console.log('✅ Conversion tracked:', event);
  } catch (error) {
    console.error('❌ Conversion tracking failed:', error);
  }
};

export const trackAdsPageview = async (page_path?: string) => {
  if (!isClient()) {
    console.warn('Pageview tracking attempted on server.');
    return;
  }

  try {
    await loadGoogleAdsScript();

    if (!isGtagReady()) {
      console.warn('gtag not ready for pageview.');
      return;
    }

    window.gtag('event', 'page_view', {
      send_to: AD_ID,
      page_path: page_path || window.location.pathname,
    });

    console.log('📄 Ads pageview tracked:', page_path || window.location.pathname);
  } catch (error) {
    console.error('❌ Ads pageview tracking failed:', error);
  }
};
