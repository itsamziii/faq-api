import type { Response, Request } from "express";
import {
    faqInputBodySchema,
    validateObjectId,
    type FAQResponse,
} from "../../utils/validation.js";
import { FAQModel, type FAQInput } from "../../models/FAQModel.js";
import { createTranslations } from "../../utils/createTranslations.js";
import { invalidateFAQCache } from "../../utils/manageCache.js";
import { logger } from "../../lib/logger.js";

export async function updateFAQ(
    req: Request,
    res: Response<FAQResponse>,
): Promise<void> {
    try {
        const { faqId } = req.params;
        if (!faqId) {
            res.status(400).json({
                data: null,
                error: "FAQ ID is required",
            });
            return;
        }

        if (!validateObjectId(faqId)) {
            res.status(400).json({
                data: null,
                error: "Invalid FAQ ID",
            });
            return;
        }

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

        const faqUpdated = await FAQModel.update(faqId, data);
        if (faqUpdated.matchedCount === 0) {
            res.status(404).json({
                data: null,
                error: "No FAQs found",
            });
            return;
        }

        if (faqUpdated.modifiedCount === 0) {
            res.status(200).json({
                data: null,
                error: "No changes made",
            });
            return;
        }

        await invalidateFAQCache();

        res.status(200).end();
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            data: null,
            error: "Internal Server Error",
        });
    }
}
