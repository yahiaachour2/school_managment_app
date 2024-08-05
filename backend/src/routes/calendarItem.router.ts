import express from 'express';

import { calendarItemController } from '../controllers/calendarItem';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();

// Calendar Item routes
routes.post("/", authenticateToken, calendarItemController.create);
routes.post("/schedule", authenticateToken, calendarItemController.createScheduleItem);

routes.get("/get/:id", authenticateToken, calendarItemController.get);
routes.get("/", authenticateToken, calendarItemController.getCalendarsItem);
routes.get("/calendar", authenticateToken, calendarItemController.getCalendarsItemsSchdule);

routes.put("/update/:id", authenticateToken, calendarItemController.update);
routes.delete("/delete/:id", authenticateToken, calendarItemController.delete);

// The getCalendarsItem route can handle filtering by teacherId and levelId through query parameters
// e.g., GET /?teacherId=123&levelId=456

export default routes;
