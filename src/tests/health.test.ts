import request from "supertest";
import { app } from "../app.js";

describe("Health Routes", () => {

  it("GET /health should return healthy or unhealthy", async () => {
    const res = await request(app).get("/health");

    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("GET /health/live should return alive", async () => {
    const res = await request(app).get("/health/live");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("alive");
  });

  it("GET /health/ready should return ready or not ready", async () => {
    const res = await request(app).get("/health/ready");

    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("database");
  });

});