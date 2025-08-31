const request = require("supertest");
const express = require("express");

// Mock models
jest.mock("../database/models/appointments", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
}));
jest.mock("../database/models/users", () => ({}));
jest.mock("../database/models/dentists", () => ({}));
jest.mock("../database/models/status", () => ({}));

// Mock verifyToken to inject a fake user
jest.mock("../verifyToken", () => (req, res, next) => {
  req.userId = 1;
  next();
});

const Appointment = require("../database/models/appointments");
const appointmentsRouter = require("./appointments");

const app = express();
app.use(express.json());
app.use("/appointments", appointmentsRouter);

describe("Appointments routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /appointments should return appointments", async () => {
    const fakeAppointments = [{ id: 1, user_id: 1 }];
    Appointment.findAll.mockResolvedValue(fakeAppointments);

    const res = await request(app).get("/appointments");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeAppointments);
    expect(Appointment.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { user_id: 1 },
      })
    );
  });

  it("POST /appointments should create appointment", async () => {
    const fakeAppointment = { id: 1, dentist_id: 2, user_id: 1 };
    Appointment.create.mockResolvedValue(fakeAppointment);

    const res = await request(app)
      .post("/appointments")
      .send({ dentist_id: 2, date: "2024-09-01", timeFrom: "10:00", timeTo: "11:00" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Appointment booked");
    expect(res.body).toHaveProperty("appointment");
    expect(Appointment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        dentist_id: 2,
        user_id: 1,
      })
    );
  });

  it("PUT /appointments/:id should update appointment", async () => {
    const mockAppointment = { update: jest.fn().mockResolvedValue(true) };
    Appointment.findOne.mockResolvedValue(mockAppointment);

    const res = await request(app)
      .put("/appointments/1")
      .send({ date: "2024-09-01", timeFrom: "09:00", timeTo: "10:00" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Appointment updated");
    expect(mockAppointment.update).toHaveBeenCalled();
  });

  it("DELETE /appointments/:id should delete appointment", async () => {
    Appointment.destroy.mockResolvedValue(1);

    const res = await request(app).delete("/appointments/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Appointment canceled");
    expect(Appointment.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "1", user_id: 1 } })
    );
  });

  it("POST /appointments/dentist should return dentist appointments", async () => {
    const fakeAppointments = [{ id: 1, dentist_id: 2, date: "2024-09-01" }];
    Appointment.findAll.mockResolvedValue(fakeAppointments);

    const res = await request(app)
      .post("/appointments/dentist")
      .send({ dentistId: 2, date: "2024-09-01" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeAppointments);
    expect(Appointment.findAll).toHaveBeenCalled();
  });
});
