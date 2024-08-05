import express from 'express';

import { roomController } from '../controllers/room';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//school

routes.post("/",authenticateToken, roomController.create);
routes.get("/getOne/:id", authenticateToken,roomController.get);
routes.get("/", authenticateToken,roomController.getRooms);
routes.put("/update/:id",authenticateToken, roomController.update);
routes.delete("/delete/:id",authenticateToken, roomController.delete);


routes.get('/available',authenticateToken, roomController.getAvailableRooms);

export default routes;