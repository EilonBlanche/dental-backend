const request = require("supertest");
const express = require("express");

jest.mock("../database/models/status", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

const Status = require("../database/models/status");
const statusRouter = require("./status");

const app = express();
app.use(express.json());
app.use("/status", statusRouter);

describe("Status routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /status should return all statuses", async () => {
    const fakeStatuses = [{ id: 1, description: "Pending" }];
    Status.findAll.mockResolvedValue(fakeStatuses);

    const res = await request(app).get("/status");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeStatuses);
    expect(Status.findAll).toHaveBeenCalled();
  });

  it("GET /status/:id should return one status", async () => {
    const fakeStatus = { id: 1, description: "Approved" };
    Status.findByPk.mockResolvedValue(fakeStatus);

    const res = await request(app).get("/status/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeStatus);
    expect(Status.findByPk).toHaveBeenCalledWith("1");
  });

  it("GET /status/:id should return 404 if not found", async () => {
    Status.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/status/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Status not found");
  });
});
