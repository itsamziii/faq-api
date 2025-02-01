import { translate } from "@vitalets/google-translate-api";
import { SUPPORTED_LANGUAGES } from "../constants.js";
import type { FAQInput } from "../models/FAQModel.js";
import { logger } from "../lib/logger.js";

type TInputBody = Pick<FAQInput, "question" | "answer">;

export async function createTranslations(
    inputBody: TInputBody,
): Promise<Pick<FAQInput, "translations">> {
    const translations = new Map<string, TInputBody>();

    for (const lang of SUPPORTED_LANGUAGES) {
        try {
            const { text } = await translate(inputBody.question, { to: lang });
            const { text: translatedAnswer } = await translate(
                inputBody.answer,
                {
                    to: lang,
                },
            );

            translations.set(lang, {
                question: text,
                answer: translatedAnswer,
            });
        } catch (error) {
            if ((error as Error).name === "TooManyRequestsError") {
                logger.error("Rate limit reached.");
                break;
            }

            logger.error(`Failed to translate to ${lang}:`, error);
            continue;
        }
    }

    return { translations };
}
