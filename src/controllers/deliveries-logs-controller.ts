import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class DeliveriesLogsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    });

    const { delivery_id, description } = bodySchema.parse(req.body);

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
    });

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    if (delivery.status === "delivered") {
      throw new AppError("This order has already been delivered");
    }

    if (delivery.status !== "shipped") {
      throw new AppError("Change status to shipped");
    }

    const logAlreadyExists = await prisma.deliveryLog.findFirst({
      where: {
        deliveryId: delivery_id,
        description,
      },
    });

    if (logAlreadyExists) {
      throw new AppError("This log already exists");
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });

    return res.status(201).json();
  }

  async show(req: Request, res: Response) {
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(req.params);

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },

      include: {
        user: true,
        logs: true,
      },
    });

    if (req.user?.role === "customer" && req.user.id !== delivery?.userId) {
      throw new AppError("the user can only view their deliveries", 404);
    }

    return res.json(delivery);
  }
}

export { DeliveriesLogsController };
