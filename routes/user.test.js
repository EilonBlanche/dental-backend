const request = require("supertest");
const express = require("express");

jest.mock("../database/models/users", () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
}));

const User = require("../database/models/users");
const usersRouter = require("./users");

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

describe("Users routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /users should return all users", async () => {
    const fakeUsers = [{ id: 1, name: "John", email: "john@test.com" }];
    User.findAll.mockResolvedValue(fakeUsers);

    const res = await request(app).get("/users");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeUsers);
    expect(User.findAll).toHaveBeenCalled();
  });

  it("GET /users/:id should return one user", async () => {
    const fakeUser = { id: 1, name: "John", email: "john@test.com" };
    User.findByPk.mockResolvedValue(fakeUser);

    const res = await request(app).get("/users/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeUser);
    expect(User.findByPk).toHaveBeenCalledWith("1", expect.any(Object));
  });

  it("GET /users/:id should return 404 if not found", async () => {
    User.findByPk.mockResolvedValue(null);

    const res = await request(app).get("/users/999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });

  it("POST /users should create a user", async () => {
    User.findOne.mockResolvedValue(null);
    const fakeUser = { id: 1, name: "John", email: "john@test.com", toJSON: () => ({ id: 1, name: "John", email: "john@test.com" }) };
    User.create.mockResolvedValue(fakeUser);

    const res = await request(app)
      .post("/users")
      .send({ name: "John", email: "john@test.com", password: "secret" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: "John", email: "john@test.com" });
    expect(User.create).toHaveBeenCalled();
  });

  it("POST /users should return 400 if email already exists", async () => {
    User.findOne.mockResolvedValue({ id: 1, email: "john@test.com" });

    const res = await request(app)
      .post("/users")
      .send({ name: "John", email: "john@test.com", password: "secret" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Email already in use");
  });

  it("PUT /users/:id should update a user", async () => {
    const fakeUser = { id: 1, name: "Old", email: "old@test.com", toJSON: () => ({ id: 1, name: "New", email: "new@test.com" }), save: jest.fn().mockResolvedValue(true) };
    User.findByPk.mockResolvedValue(fakeUser);

    const res = await request(app)
      .put("/users/1")
      .send({ name: "New", email: "new@test.com", isAdmin: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: "New", email: "new@test.com" });
    expect(fakeUser.save).toHaveBeenCalled();
  });

  it("DELETE /users/:id should delete a user", async () => {
    const fakeUser = { id: 1, destroy: jest.fn().mockResolvedValue(true) };
    User.findByPk.mockResolvedValue(fakeUser);

    const res = await request(app).delete("/users/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted");
    expect(fakeUser.destroy).toHaveBeenCalled();
  });
});
