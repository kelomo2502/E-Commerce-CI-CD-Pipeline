const request = require("supertest");
const app = require("../home");

describe("GET /", () => {
  it("should return a greeting message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("Welcome home");
  });
});
