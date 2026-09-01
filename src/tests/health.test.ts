import "@/config/load-env.js";
import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "@/app.js";

describe("GET /api/v1/health/live", () => {
  test("Should return 200 with a status alive body", async () => {
    const response = await request(app).get("/api/v1/health/live");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "alive" });
  });
});
