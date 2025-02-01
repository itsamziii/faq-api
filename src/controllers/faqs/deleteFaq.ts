import type { Request, Response } from "express";
import { invalidateFAQCache } from "../../utils/manageCache.js";
import { logger } from "../../lib/logger.js";
import { FAQModel } from "../../models/FAQModel.js";
import { validateObjectId, type FAQResponse } from "../../utils/validation.js";

export async function deleteFAQ(
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

        const deleted = await FAQModel.remove(faqId);

        if (!deleted.deletedCount) {
            res.status(404).json({
                data: null,
                error: "No FAQs found",
            });
            return;
        }

        await invalidateFAQCache();

        res.status(204).end();
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            data: null,
            error: "Internal Server Error",
        });
    }
}
