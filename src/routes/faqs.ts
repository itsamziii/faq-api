import { Router } from "express";
import {
    deleteFAQ,
    getFAQ,
    getFAQs,
    createFAQ,
    updateFAQ,
} from "../controllers/faqs/index.js";
import { auth } from "../middlewares/auth.js";
import { UserRole } from "../constants.js";

const router: Router = Router();

router.get("/", getFAQs);

router.get("/:faqId", getFAQ);

router.post("/", auth([UserRole.ADMIN]), createFAQ);

// Using the PUT method to enforce idempotency
router.put("/:faqId", auth([UserRole.ADMIN]), updateFAQ);

router.delete("/:faqId", auth([UserRole.ADMIN]), deleteFAQ);

export default router;
