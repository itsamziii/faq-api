/* eslint-disable @typescript-eslint/no-misused-promises */
import request from "supertest";
import { test, describe, expect } from "vitest";
import app from "../src/app.js";

describe("Server Tests", () => {
    test("Health check endpoint returns 200", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, World!");
    });

    test("CORS headers are present", async () => {
        const response = await request(app).get("/");
        expect(response.headers["access-control-allow-origin"]).toBeDefined();
    });

    test("Unknown route returns 404", async () => {
        const response = await request(app).get("/unknown-route");
        expect(response.status).toBe(404);
    });
});
