const request = require("supertest");
const services = require("../services");

describe("GET /services", () => {
  it("should return a greeting message", async () => {
    const response = await request(services).get("/services");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual("We offer good services");
  });
});
