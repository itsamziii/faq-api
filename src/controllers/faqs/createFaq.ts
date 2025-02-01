import type { Response, Request } from "express";
import { FAQModel, type FAQInput } from "../../models/FAQModel.js";
import {
    faqInputBodySchema,
    type FAQResponse,
} from "../../utils/validation.js";
import { createTranslations } from "../../utils/createTranslations.js";
import { invalidateFAQCache } from "../../utils/manageCache.js";
import { logger } from "../../lib/logger.js";

export async function createFAQ(
    req: Request<unknown, unknown, FAQInput>,
    res: Response<FAQResponse>,
): Promise<void> {
    try {
        const parsedBodyResult = faqInputBodySchema.safeParse(req.body);
        if (!parsedBodyResult.success) {
            res.status(400).json({
                data: null,
                error: "Invalid request body",
            });
            return;
        }

        const data = parsedBodyResult.data as FAQInput;
        const { translations } = await createTranslations(data);

        data.translations = translations;

        const faqCreated = await FAQModel.add(data);

        await invalidateFAQCache();

        res.status(201).json({
            data: faqCreated,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            data: null,
            error: "Internal Server Error",
        });
    }
}
