import { app } from "../app.js";
import request from "supertest";

describe("Metrics Route", () => {

  it("GET /metrics should return prometheus format", async () => {
    const res = await request(app).get("/metrics");

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain|text\/; charset=utf-8/);
    expect(res.text).toBeDefined();
  });

});