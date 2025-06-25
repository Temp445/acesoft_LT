// src/lib/google/usePathConversion.ts
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackConversion } from './ads';

const conversionPages: Record<string, string> = {
    '/thank-you': 'ABC123LABEL',    // conversion label for thank-you page. Get it from Google Ads and set it in .env
    '/checkout-success': 'XYZ987LABEL',
};

type Props = {
    trackPathConversion?: boolean;
};

export const usePathConversion = ({ trackPathConversion = false }: Props) => {
    const pathname = usePathname();
    const trackedRef = useRef(false); // ensure one-time tracking per session

    useEffect(() => {
        if (!trackPathConversion) return;

        const convLabel = conversionPages[pathname];
        if (convLabel && !trackedRef.current) {
            trackConversion(convLabel);
            trackedRef.current = true;
        }

        // reset if leaving the page
        if (!convLabel) {
            trackedRef.current = false;
        }
    }, [pathname, trackPathConversion]);
};

