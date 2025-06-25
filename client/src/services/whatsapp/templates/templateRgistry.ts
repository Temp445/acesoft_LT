import { enquiryTemplateMeta, EnquiryData } from '@/services/whatsapp/templates/enquiry.template';
import { enquiryGreetingsTemplateMeta, EnquiryGreetingsData } from '@/services/whatsapp/templates/enquiry_greetings.template';
import { TemplateMeta } from '../types';


// TemplatePayloadMap a union type of all supported template payloads
export type TemplatePayloadMap = {
  enquiry_form: EnquiryData;
  customer_greetings: EnquiryGreetingsData;
};

export type TemplateId = keyof TemplatePayloadMap;

export const templateRegistry: {
  [K in TemplateId]: TemplateMeta<TemplatePayloadMap[K]>
} = {
  enquiry_form: enquiryTemplateMeta,
  customer_greetings: enquiryGreetingsTemplateMeta,
};


export function getTemplateMeta<K extends TemplateId>(templateId: K): TemplateMeta<TemplatePayloadMap[K]> {
  return templateRegistry[templateId];
}

export function isTemplateId(id: string): id is TemplateId {
  return id in templateRegistry;
}