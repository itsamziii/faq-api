/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import type { FAQResponse } from "../src/utils/validation.js";
import env from "../src/env.js";
import { FAQModel, type IFAQ } from "../src/models/FAQModel.js";

const mockupAdminToken = jwt.sign(
    { user: "Amziii", role: "admin" },
    env.JWT_SECRET,
    { expiresIn: "1m" },
);

describe("POST /api/faqs", () => {
    test("should create new FAQ with valid data", async () => {
        const response = await request(app)
            .post("/api/faqs")
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "What is MongoDB?",
                answer: "MongoDB is a NoSQL database",
            });

        expect(response.status).toBe(201);

        const { data } = response.body as FAQResponse<IFAQ>;

        expect(data).toBeDefined();
        expect(data).toHaveProperty("question", "What is MongoDB?");
        expect(data).toHaveProperty("translations");

        if (data) {
            await FAQModel.remove(data._id.toString());
        }
    });

    test("should return 400 when question is missing", async () => {
        const response = await request(app)
            .post("/api/faqs")
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                answer: "Test answer",
            });

        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 400 when answer is missing", async () => {
        const response = await request(app)
            .post("/api/faqs")
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Test question?",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 400 when question is empty", async () => {
        const response = await request(app)
            .post("/api/faqs")
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "",
                answer: "Test answer",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 400 when answer is empty", async () => {
        const response = await request(app)
            .post("/api/faqs")
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Test question?",
                answer: "",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 401 when no auth token provided", async () => {
        const response = await request(app).post("/api/faqs").send({
            question: "Test question?",
            answer: "Test answer",
        });

        expect(response.status).toBe(401);
    });
});

describe("PUT /api/faqs/:faqId", () => {
    let testFaqId: string;

    beforeAll(async () => {
        // Create a test FAQ to update
        const createResponse = await request(app)
            .post("/api/faqs")
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Original question?",
                answer: "Original answer",
            });
        const responseData = (createResponse.body as FAQResponse<IFAQ>).data;
        if (!responseData) throw new Error("Failed to create test FAQ");
        testFaqId = responseData._id.toString();
    });

    afterAll(async () => {
        if (testFaqId) {
            await FAQModel.remove(testFaqId);
        }
    });

    test("should update FAQ with valid data", async () => {
        const response = await request(app)
            .put(`/api/faqs/${testFaqId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Updated question?",
                answer: "Updated answer",
            });

        expect(response.status).toBe(200);
    });

    test("should return 400 when question is missing", async () => {
        const response = await request(app)
            .put(`/api/faqs/${testFaqId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                answer: "Test answer",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 400 when answer is missing", async () => {
        const response = await request(app)
            .put(`/api/faqs/${testFaqId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Test question?",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 400 when question is empty", async () => {
        const response = await request(app)
            .put(`/api/faqs/${testFaqId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "",
                answer: "Test answer",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 400 when answer is empty", async () => {
        const response = await request(app)
            .put(`/api/faqs/${testFaqId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Test question?",
                answer: "",
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid request body");
    });

    test("should return 401 when no auth token provided", async () => {
        const response = await request(app).put(`/api/faqs/${testFaqId}`).send({
            question: "Test question?",
            answer: "Test answer",
        });

        expect(response.status).toBe(401);
    });

    test("should return 404 when FAQ doesn't exist", async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .put(`/api/faqs/${nonExistentId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Test question?",
                answer: "Test answer",
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "No FAQs found");
    });
});

describe("DELETE /api/faqs/:faqId", () => {
    let testFaqId: string;

    beforeAll(async () => {
        // Create a test FAQ for deletion
        const createResponse = await request(app)
            .post("/api/faqs")
            .set("Authorization", `Bearer ${mockupAdminToken}`)
            .send({
                question: "Test question?",
                answer: "Test answer",
            });
        const responseData = (createResponse.body as FAQResponse<IFAQ>).data;
        if (!responseData) {
            throw new Error("Failed to create test FAQ");
        }

        testFaqId = responseData._id.toString();
    });

    afterAll(async () => {
        if (testFaqId) {
            await FAQModel.remove(testFaqId);
        }
    });

    test("should delete FAQ with valid ID", async () => {
        const response = await request(app)
            .delete(`/api/faqs/${testFaqId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`);

        expect(response.status).toBe(204);
    });

    test("should return 401 when no auth token provided", async () => {
        const response = await request(app).delete(`/api/faqs/${testFaqId}`);

        expect(response.status).toBe(401);
    });

    test("should return 404 when FAQ doesn't exist", async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .delete(`/api/faqs/${nonExistentId}`)
            .set("Authorization", `Bearer ${mockupAdminToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error", "No FAQs found");
    });

    test("should return 400 when FAQ ID is invalid", async () => {
        const response = await request(app)
            .delete("/api/faqs/invalid-id")
            .set("Authorization", `Bearer ${mockupAdminToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error", "Invalid FAQ ID");
    });
});
