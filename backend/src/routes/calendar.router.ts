import express from 'express';

import { calendarController } from '../controllers/calendar';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//room

routes.post("/",authenticateToken, calendarController.create);
routes.get("/get/:id", authenticateToken,calendarController.get);
routes.get("/", authenticateToken,calendarController.getCalendars);
routes.put("/update/:id",authenticateToken, calendarController.update);
routes.delete("/delete/:id",authenticateToken, calendarController.delete);

// routes.get('/search', calendarController.search);


export default routes;