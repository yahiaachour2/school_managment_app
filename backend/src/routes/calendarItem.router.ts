import express from 'express';

import { calendarItemController } from '../controllers/calendarItem';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();

// Calendar Item routes
//calendar
routes.post("/", authenticateToken, calendarItemController.create);
//scedule
routes.get("/", authenticateToken, calendarItemController.getScheduleItem);

//secedule
routes.post("/schedule", authenticateToken, calendarItemController.createScheduleItem);
//calendar
routes.get("/calendar", authenticateToken, calendarItemController.getCalendarsItems);



routes.put("/update/:id", authenticateToken, calendarItemController.update);
routes.delete("/delete/:id", authenticateToken, calendarItemController.delete);
routes.get("/get/:id", authenticateToken, calendarItemController.get);


export default routes;
