import { ZodSchema } from 'zod';

export type ComponentType = "body" | "header" | "footer";

export type ComponentMapEntry<T> = {
    key: keyof T;
    type: "text" | "image" | "date_time";
    component: ComponentType;
};

// Define a common type for your template metadata
export type TemplateMeta<T extends object> = {
    templateId: string;
    name: string;
    description?: string;
    language?: string;
    placeholders: (keyof T)[];
    schema: ZodSchema<T>;
    componentsMap: ComponentMapEntry<T>[];
};

