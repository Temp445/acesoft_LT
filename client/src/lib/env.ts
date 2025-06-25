// lib/env.ts
import { z } from 'zod';

// Schema definition
const envSchema = z.object({
    // Server-only variables
    STROMX_API_TOKEN: z.string(),
    ADMIN_PHONES: z.string(),
    EMAIL_VALIDATOR_URL: z.string().url(),
    EMAIL_VALIDATOR_SECRET: z.string(),

    // Public (client) variables — must be prefixed with NEXT_PUBLIC_
    NEXT_PUBLIC_API_BASE_URL: z.string().url().default('http://localhost:3000/api'),

    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_CALENDLY_URL: z.string().url().optional().default(''),
    NEXT_PUBLIC_WHATSAPP_API_URL: z.string().url().optional().default('/api/send-whatsapp'),

    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().default(''),
    NEXT_PUBLIC_GA_ADS_CONVERSION_ID: z.string().optional().default(''),
    NEXT_PUBLIC_GA_ENQ_CONVERSION_LABEL: z.string().optional().default(''),

    NEXT_PUBLIC_APP_ENV: z.enum(['development', 'production', 'staging']).default('development'),

    NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string(),
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID: z.string(),

    // Example boolean and number vars
    // NEXT_PUBLIC_FEATURE_FLAG: z.coerce.boolean().optional().default(false),
    // NEXT_PUBLIC_TIMEOUT: z.coerce.number().optional().default(5000),
});

// Validate at runtime
const env = envSchema.parse(process.env);

export { env };
