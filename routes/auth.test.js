const request = require("supertest");
const express = require("express");

jest.mock("../database/models/users", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
}));
const User = require("../database/models/users");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake-jwt-token"),
}));
const jwt = require("jsonwebtoken");

const authRouter = require("../routes/auth");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("Auth routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /auth/register should create a new user", async () => {
    User.create.mockResolvedValue({
      id: 1,
      name: "Alice",
      email: "alice@example.com",
    });

    const res = await request(app).post("/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "secret",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User created");
    expect(res.body.user).toMatchObject({ id: 1, name: "Alice", email: "alice@example.com" });
  });

  it("POST /auth/register should fail if email already exists", async () => {
    User.create.mockRejectedValue(new Error("duplicate"));

    const res = await request(app).post("/auth/register").send({
      name: "Bob",
      email: "bob@example.com",
      password: "secret",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email already in use");
  });

  it("POST /auth/login should return token with valid credentials", async () => {
    const fakeUser = {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      isAdmin: false,
      checkPassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(fakeUser);

    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "secret",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", "fake-jwt-token");
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, expect.any(String), { expiresIn: "1h" });
  });

  it("POST /auth/login should fail with wrong email", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/auth/login").send({
      email: "notfound@example.com",
      password: "secret",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("POST /auth/login should fail with wrong password", async () => {
    const fakeUser = {
      id: 1,
      email: "alice@example.com",
      checkPassword: jest.fn().mockResolvedValue(false),
    };
    User.findOne.mockResolvedValue(fakeUser);

    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "wrongpass",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
