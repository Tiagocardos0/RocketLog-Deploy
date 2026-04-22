import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("usersController", () => {
  
  let userId: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Test123",
      email: "test123@exemple.com",
      password: "password123",
    });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
    expect(response.body.name).toBe("Test123");

    userId = response.body.id;
  });

  it("should throw an error if user with same email already exists", async () => {

    const response = await request(app).post("/users").send({
      name: "duplicate Users",
      email: "test123@exemple.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User with this email already exists");
  })

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Invalid Email User",
      email: "invalid-email",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");
  })
});