// src/lib/google/useEventConversion.ts
'use client';

import { useEffect, useRef } from 'react';
import { TrackConversionOptions, trackConversion } from './ads';

type Props = {
    conversionLabel?: string;
    trackConversionOptions?: TrackConversionOptions;
};

export const useEventConversion = (
    conversionLabel?: string,
    trackConversionOptions?: TrackConversionOptions
) => {
    const trackedRef = useRef(false);

    useEffect(() => {
        if (!conversionLabel || trackedRef.current) return;

        trackConversion(conversionLabel, trackConversionOptions || {});
        trackedRef.current = true;
    }, [conversionLabel, trackConversionOptions]);
};

