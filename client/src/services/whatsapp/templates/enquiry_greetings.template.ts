import { z } from 'zod';
import { TemplateMeta } from '../types';

const enquiryGreetingsSchema = z.object({
    fullName: z.string(),
    product: z.string(),
    siteUrl: z.string().url(),
    imageUrl: z.string().url(), // image
});

export type EnquiryGreetingsData = z.infer<typeof enquiryGreetingsSchema>;

export const enquiryGreetingsTemplateMeta: TemplateMeta<EnquiryGreetingsData> = {
    templateId: 'customer_greetings',
    name: 'Enquiry Greetings',
    placeholders: [
        'fullName',
        'product',
        'siteUrl',
        'imageUrl'
    ],
    schema: enquiryGreetingsSchema,
    componentsMap: [
        { key: 'imageUrl', type: 'image', component: 'header' },
        { key: 'fullName', type: 'text', component: 'body' },
        { key: 'product', type: 'text', component: 'body' },
        { key: 'siteUrl', type: 'text', component: 'body' },
    ],
};