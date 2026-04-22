import { Router } from "express";

import { UsersController } from "@/controllers/users-controller";

const usersController = new UsersController();

const usersRoutes = Router()

usersRoutes.post('/', usersController.create)

export { usersRoutes }