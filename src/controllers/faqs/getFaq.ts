import type { Response, Request } from "express";
import { validateObjectId, type FAQResponse } from "../../utils/validation.js";
import { FAQModel, type IFAQ } from "../../models/FAQModel.js";
import { logger } from "../../lib/logger.js";

export async function getFAQ(
    req: Request,
    res: Response<FAQResponse<IFAQ>>,
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

        const faq = await FAQModel.get(faqId);

        if (!faq) {
            res.status(404).json({
                data: null,
                error: "No FAQs found",
            });
            return;
        }

        res.status(200).json({
            data: faq,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            data: null,
            error: "Internal Server Error",
        });
    }
}
