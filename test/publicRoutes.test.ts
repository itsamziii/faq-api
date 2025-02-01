/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, beforeAll, afterAll, test, expect } from "vitest";
import request from "supertest";
import { connectMongo } from "../src/utils/connectMongo.js";
import {
    FAQModel,
    type FAQTranslated,
    type IFAQ,
} from "../src/models/FAQModel.js";
import mongoose from "mongoose";
import app from "../src/app.js";
import type { FAQResponse } from "../src/utils/validation.js";

const insertedFaqIds: mongoose.Types.ObjectId[] = [];

beforeAll(async () => {
    await connectMongo();

    const insertedDocs = await FAQModel.insertMany([
        {
            question: "What is the capital of France?",
            answer: "Paris",
            translations: new Map([
                [
                    "hi",
                    { question: "फ्रांस की राजधानी क्या है?", answer: "पेरिस" },
                ],
            ]),
        },
    ]);

    insertedFaqIds.push(...insertedDocs.map((doc) => doc._id));
});

afterAll(async () => {
    await FAQModel.deleteMany({ _id: { $in: insertedFaqIds } });
    await mongoose.connection.close();
});

describe("GET /api/faqs", () => {
    test("should return all FAQs", async () => {
        const response = await request(app).get("/api/faqs");

        expect(response.status).toBe(200);

        const { data } = response.body as FAQResponse<FAQTranslated[]>;

        expect(data).toBeDefined();
        expect(Array.isArray(data) && data.length > 0).toBe(true);
        expect(
            Array.isArray(data) && data.length > 0 && data[0],
        ).toHaveProperty("question");
    });

    test("should return FAQs in Hindi", async () => {
        const response = await request(app)
            .get("/api/faqs")
            .query({ lang: "hi" });

        const { data } = response.body as FAQResponse<FAQTranslated[]>;

        expect(data).toBeDefined();
        expect(Array.isArray(data) && data.length > 0).toBe(true);
        expect(
            Array.isArray(data) && data.length > 0 && data[0],
        ).toHaveProperty("question");
    });

    test("should fallback to english for non-existent language", async () => {
        const response = await request(app)
            .get("/api/faqs")
            .query({ lang: "xx" });

        const { data, error } = response.body as FAQResponse<FAQTranslated[]>;

        expect(data).toBeDefined();
        expect(Array.isArray(data) && data.length > 0).toBe(true);
        expect(
            Array.isArray(data) && data.length > 0 && data[0],
        ).toHaveProperty("question");
        expect(error).toBeDefined();
    });
});

describe("GET /api/faq/:faqId", () => {
    test("should return single FAQ by ID", async () => {
        const response = await request(app).get(
            `/api/faqs/${String(insertedFaqIds[0]?.toHexString())}`,
        );

        expect(response.status).toBe(200);

        const { data } = response.body as FAQResponse<IFAQ>;

        expect(data).toBeDefined();
        expect(data).toHaveProperty("question");
    });

    test("should return 404 for non-existent FAQ", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(
            `/api/faqs/${nonExistentId.toHexString()}`,
        );

        expect(response.status).toBe(404);
    });
});
