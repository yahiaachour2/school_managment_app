import express from 'express';

import { calendarItemController } from '../controllers/calendarItem';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//room

routes.post("/",authenticateToken, calendarItemController.create);
routes.post("/schedule", authenticateToken,calendarItemController.createScheduleItem);

routes.get("/get/:id",authenticateToken, calendarItemController.get);
routes.get("/",authenticateToken, calendarItemController.getCalendarsItem);
routes.put("/update/:id",authenticateToken, calendarItemController.update);
routes.delete("/delete/:id",authenticateToken, calendarItemController.delete);



export default routes;