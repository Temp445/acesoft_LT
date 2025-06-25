import { TemplateMeta, ComponentType } from "../types";

type Parameter =
    | { type: "text"; text: string }
    | { type: "date_time"; date_time: { fallback_value: string } }
    | { type: "image"; image: { link: string } };

type Component = {
    type: ComponentType;
    parameters: Parameter[];
};

type WhatsAppPayload = {
    type: "template";
    template: {
        name: string;
        language: { policy: "deterministic"; code: string };
        components: Component[];
    };
};

// Helper to convert any value to a safe string
function safeString(value: unknown): string {
    try {
        if (typeof value === "string") return value;
        if (value instanceof Date)
            return value.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        if (value !== null && value !== undefined) return String(value);
    } catch { }
    return "[Missing]";
}

export function generateWhatsAppPayload<T extends object>(
    meta: TemplateMeta<T>,
    data: T,
    languageCode = "en"
): WhatsAppPayload {
    const result = meta.schema.safeParse(data);
    if (!result.success) {
        throw new Error(
            `Invalid template data: ${JSON.stringify(
                result.error.format(),
                null,
                2
            )}`
        );
    }

    const validatedData = result.data;
    const componentMap = new Map<string, Parameter[]>();

    for (const { key, type, component } of meta.componentsMap) {
        const rawValue = validatedData[key];

        let param: Parameter;

        switch (type) {
            case "text":
                param = { type: "text", text: safeString(rawValue) };
                break;

            case "date_time":
                const date =
                    rawValue instanceof Date
                        ? rawValue
                        : new Date(safeString(rawValue)); // convert if needed
                param = {
                    type: "date_time",
                    date_time: {
                        fallback_value: safeString(date),
                    },
                };
                break;

            case "image":
                if (typeof rawValue === "string") {
                    param = { type: "image", image: { link: rawValue } };
                } else {
                    param = { type: "image", image: { link: "[Missing Image URL]" } };
                }
                break;

            default:
                param = { type: "text", text: safeString(rawValue) };
        }

        if (!componentMap.has(component)) {
            componentMap.set(component, []);
        }

        componentMap.get(component)!.push(param);
    }

    const components: Component[] = Array.from(componentMap.entries()).map(
        ([type, parameters]) => ({
            type: type as ComponentType,
            parameters,
        })
    );

    return {
        type: "template",
        template: {
            name: meta.templateId,
            language: {
                policy: "deterministic",
                code: languageCode,
            },
            components,
        },
    };
}
