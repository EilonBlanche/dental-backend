const request = require("supertest");
const express = require("express");

jest.mock("../database/models/dentists", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

const Dentist = require("../database/models/dentists");
const dentistsRouter = require("./dentists");

const app = express();
app.use(express.json());
app.use("/dentists", dentistsRouter);

describe("Dentists routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /dentists should return list of dentists", async () => {
    const fakeDentists = [{ id: 1, name: "Dr. Smith" }];
    Dentist.findAll.mockResolvedValue(fakeDentists);

    const res = await request(app).get("/dentists");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeDentists);
    expect(Dentist.findAll).toHaveBeenCalled();
  });

  it("POST /dentists should create a dentist", async () => {
    const fakeDentist = { id: 1, name: "Dr. Adams" };
    Dentist.create.mockResolvedValue(fakeDentist);

    const res = await request(app)
      .post("/dentists")
      .send({ name: "Dr. Adams", email: "adam@example.com" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeDentist);
    expect(Dentist.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Dr. Adams",
        email: "adam@example.com",
      })
    );
  });

  it("POST /dentists should fail if name is missing", async () => {
    const res = await request(app).post("/dentists").send({ email: "missing@example.com" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Name is required");
    expect(Dentist.create).not.toHaveBeenCalled();
  });

  it("PUT /dentists/:id should update a dentist", async () => {
    const mockDentist = {
      id: 1,
      name: "Old Name",
      save: jest.fn().mockResolvedValue(true),
    };
    Dentist.findByPk.mockResolvedValue(mockDentist);

    const res = await request(app)
      .put("/dentists/1")
      .send({ name: "New Name" });

    expect(res.status).toBe(200);
    expect(mockDentist.name).toBe("New Name");
    expect(mockDentist.save).toHaveBeenCalled();
  });

  it("PUT /dentists/:id should return 404 if dentist not found", async () => {
    Dentist.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .put("/dentists/999")
      .send({ name: "Doesn't Exist" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Dentist not found");
  });

  it("DELETE /dentists/:id should delete a dentist", async () => {
    const mockDentist = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(true),
    };
    Dentist.findByPk.mockResolvedValue(mockDentist);

    const res = await request(app).delete("/dentists/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Dentist deleted");
    expect(mockDentist.destroy).toHaveBeenCalled();
  });

  it("DELETE /dentists/:id should return 404 if dentist not found", async () => {
    Dentist.findByPk.mockResolvedValue(null);

    const res = await request(app).delete("/dentists/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Dentist not found");
  });
});
