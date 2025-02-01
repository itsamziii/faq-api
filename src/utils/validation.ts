import { z } from "zod";
import mongoose from "mongoose";
import type { FAQTranslated, IFAQ } from "../models/FAQModel.js";

export interface FAQResponse {
    data: FAQTranslated[] | IFAQ | null;
    error?: string;
}

// Schema Validation
export const faqInputBodySchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
});

export const querySchema = z.object({
    lang: z.string().min(2).max(5).default("en"),
});

// Response Builder
export function buildResponse(
    faqs: FAQTranslated[],
    lang: string,
): FAQResponse {
    const hasTranslations = faqs.some((faq) => faq.language === lang);
    return {
        data: faqs,
        ...(!hasTranslations &&
            lang !== "en" && {
                error: `No translations found for ${lang}, using English fallback`,
            }),
    };
}

// MongoDB ObjectId Validation
export function validateObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}
