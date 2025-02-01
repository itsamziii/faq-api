import type { Response, Request } from "express";
import {
    buildResponse,
    querySchema,
    type FAQResponse,
} from "../../utils/validation.js";
import redis from "../../lib/redis.js";
import { logger } from "../../lib/logger.js";
import { FAQModel, type FAQTranslated } from "../../models/FAQModel.js";
import { setCache } from "../../utils/manageCache.js";

export async function getFAQs(
    req: Request,
    res: Response<FAQResponse>,
): Promise<void> {
    try {
        const parsedLangResult = querySchema.safeParse(req.query);
        const lang = parsedLangResult.success
            ? parsedLangResult.data.lang
            : "en";
        const cacheKey = `faqs:${lang}`;

        const cachedData = await redis.get(cacheKey).catch((err: unknown) => {
            logger.error("Redis cache fetch failed:", err);
            return null;
        });

        if (cachedData) {
            const faqs = JSON.parse(cachedData) as FAQTranslated[];

            res.status(200).json(buildResponse(faqs, lang));
            return;
        }

        const faqs = await FAQModel.find();

        if (!faqs.length) {
            res.status(404).json({
                data: null,
                error: "No FAQs found",
            });
            return;
        }

        const transformedFaqs = faqs.map((faq) => faq.getTranslated(lang));

        await setCache(cacheKey, transformedFaqs);

        res.status(200).json(buildResponse(transformedFaqs, lang));
        return;
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            data: null,
            error: "Internal Server Error",
        });
    }
}
