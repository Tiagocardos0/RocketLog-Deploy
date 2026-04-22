import { Router } from "express";
import { DeliveriesLogsController } from "@/controllers/deliveries-logs-controller";
import { ensureAuthenticated } from "@/middleware/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middleware/verifyUserAuthorization";

const deliveriesLogsRoutes = Router();
const deliveriesLogsController = new DeliveriesLogsController();


deliveriesLogsRoutes.use(ensureAuthenticated);

deliveriesLogsRoutes.post(
    '/', 
    verifyUserAuthorization(['sale']),
    deliveriesLogsController.create
);

deliveriesLogsRoutes.get(
    '/:delivery_id/show',
    ensureAuthenticated,
    verifyUserAuthorization(['sale', 'customer']),
    deliveriesLogsController.show
);

export { deliveriesLogsRoutes };