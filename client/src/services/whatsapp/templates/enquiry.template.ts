import { z } from 'zod';
import { TemplateMeta } from '../types';

const enquirySchema = z.object({
    originateFrom: z.string(),
    fullName: z.string(),
    companyName: z.string(),
    businessEmail: z.string().email(),
    mobileNumber: z.string(),
    location: z.string(),
    productInterest: z.string(),
    message: z.string()
});

export type EnquiryData = z.infer<typeof enquirySchema>;

export const enquiryTemplateMeta: TemplateMeta<EnquiryData> = {
    templateId: 'enquiry_form',
    name: 'Enquiry Form',
    placeholders: [
        'originateFrom',
        'fullName',
        'companyName',
        'businessEmail',
        'mobileNumber',
        'location',
        'productInterest',
        'message'
        // optional: 'submittedAt'
    ],
    schema: enquirySchema,
    componentsMap: [
        { key: 'originateFrom', type: 'text', component: 'body' },
        { key: 'fullName', type: 'text', component: 'body' },
        { key: 'companyName', type: 'text', component: 'body' },
        { key: 'businessEmail', type: 'text', component: 'body' },
        { key: 'mobileNumber', type: 'text', component: 'body' },
        { key: 'location', type: 'text', component: 'body' },
        { key: 'productInterest', type: 'text', component: 'body' },
        { key: 'message', type: 'text', component: 'body' }
    ]
};