import { Router } from "express";
import { getFAQs } from "../controllers/faqs/getFaqs.js";
import { getFAQ } from "../controllers/faqs/getFaq.js";

const router: Router = Router();

router.get("/", getFAQs);

router.get("/:faqId", getFAQ);

export default router;
