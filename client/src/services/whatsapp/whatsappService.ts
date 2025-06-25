import { generateWhatsAppPayload } from "./templates/payloadGenerator";
import { templateRegistry, TemplateId, TemplatePayloadMap, isTemplateId } from './templates/templateRgistry';
// import { env } from "@/lib/env"

export async function sendWhatsappMessage<K extends TemplateId>(
    templateId: K,
    templateData: TemplatePayloadMap[K],
    phone?: string
): Promise<void> {


    if (!templateId || !templateData) {
        console.error("Invalid parameters for sending WhatsApp message.");
        return;
    }

    if (!isTemplateId(templateId)) {
        throw new Error(`Unknown template ID: ${templateId}`);
    }

    const meta = templateRegistry[templateId]; // ✅ Type is TemplateMeta<TemplatePayloadMap[typeof templateId]>

    // Now check type compatibility manually
    const result = meta.schema.safeParse(templateData);

    if (!result.success) {
        throw new Error(
            `Invalid template data: ${JSON.stringify(result.error.format(), null, 2)}`
        );
    }

    if (meta && meta.schema) {
        const result = meta.schema.safeParse(templateData);
        if (!result.success) {
            console.error(`Validation failed for template ${templateId}`, result.error);
            return;
        }
    }
    else {
        console.error(`Template ${templateId} not found in registry.`);
        return;
    }

    // Generate the WhatsApp message payload
    const messagePayload = generateWhatsAppPayload(meta, templateData);

    const endpoint = process.env.NEXT_PUBLIC_WHATSAPP_API_URL ?? '/api/send-whatsapp';

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: messagePayload, to: phone })
        });
        const data = await response.json();

        if (response.ok) {
            console.log(`WhatsApp sent to ${phone}:`, data);
        } else {
            console.error(`WhatsApp failed for ${phone}:`, data);
        }
    } catch (error) {
        console.error(`WhatsApp error for ${phone}:`, error);
    }

    // Proceed to send the message using templateId and validated data
    console.log(`Sending WhatsApp message using template: ${templateId}`);
    console.log("Data:", templateData);
}
