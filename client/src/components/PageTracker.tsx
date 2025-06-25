// src/components/PageTracker.tsx
'use client';

import { useTracking } from '@/lib/google/useTracking';
import { usePathConversion } from '@/lib/google/usePathConversion';
import { useEventConversion } from '@/lib/google/useEventConversion';

type Props = {
    conversionLabel?: string;	// Optional conversion label for custom tracking
    trackPathConversion?: boolean;	// Whether to track path conversions
    trackEventOptions?: Record<string, any>;	// Optional label for event tracking
};

export const PageTracker = ({
    trackPathConversion = false,
    conversionLabel,
    trackEventOptions,
}: Props) => {
    useTracking();
    usePathConversion({ trackPathConversion });
    useEventConversion(conversionLabel, trackEventOptions);

    return null;
};
