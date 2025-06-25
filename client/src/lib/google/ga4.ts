// src/lib/google/ga4.ts
// import { env } from "@/lib/env"

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

interface PageViewOptions {
  page_path?: string;
  page_title?: string;
}

interface EventOptions {
  action: string;
  category?: string;
  label?: string;
  value?: number;
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

const isClient = () => typeof window !== 'undefined';

const isGtagReady = (): boolean =>
  isClient() && typeof window.gtag === 'function' && Array.isArray(window.dataLayer);

const validateGAConfig = (): boolean => {
  if (!GA_ID) {
    console.error('❌ GA4 ID missing. Set NEXT_PUBLIC_GA_MEASUREMENT_ID.');
    return false;
  }
  return true;
};

const loadGA4Script = (): Promise<void> => {
  if (!isClient()) return Promise.reject(new Error('SSR: window is not available'));

  if (isInitialized) return Promise.resolve();

  if (initializationPromise) return initializationPromise;

  initializationPromise = new Promise((resolve, reject) => {
    if (!validateGAConfig()) {
      reject(new Error('Missing GA4 config'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function (...args: unknown[]) {
        window.dataLayer!.push(...args);
      };

      window.gtag('js', new Date());
      window.gtag('config', GA_ID!, { send_page_view: false });

      isInitialized = true;
      resolve();
    };

    script.onerror = () => reject(new Error('Failed to load gtag.js'));

    document.head.appendChild(script);
  });

  return initializationPromise;
};

export const trackPageview = async (options: PageViewOptions = {}) => {
  if (!isClient()) return;

  try {
    await loadGA4Script();

    if (!isGtagReady()) return;

    window.gtag('config', GA_ID!, {
      page_path: options.page_path || window.location.pathname,
      page_title: options.page_title || document.title,
    });
    console.log('📄 Pageview tracked');
  } catch (error) {
    console.error('❌ GA4 pageview failed:', error);
  }
};

export const trackEvent = async (options: EventOptions) => {
  if (!isClient()) return;

  try {
    await loadGA4Script();

    if (!isGtagReady()) return;

    window.gtag('event', options.action, {
      event_category: options.category,
      event_label: options.label,
      value: options.value,
    });
    console.log('🎯 Event tracked:', options);
  } catch (error) {
    console.error('❌ GA4 event tracking failed:', error);
  }
};
