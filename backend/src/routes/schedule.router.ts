import express from 'express';

import { scheduleController } from '../controllers/schedule';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//school

routes.post("/",authenticateToken,scheduleController.create);
routes.get("/getOne/:id",authenticateToken, scheduleController.get);
routes.get("/", authenticateToken,scheduleController.getSchedules);
routes.put("/update/:id",authenticateToken, scheduleController.update);
routes.delete("/delete/:id", scheduleController.delete);
export default routes;