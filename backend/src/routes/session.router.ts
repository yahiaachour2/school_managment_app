import express from 'express';

import { sessionController } from '../controllers/session';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//room

routes.post("/",authenticateToken,sessionController.create);
routes.get("/getOne/:id",authenticateToken, sessionController.get);
routes.get("/",authenticateToken, sessionController.getSessions);
routes.put("/update/:id",authenticateToken, sessionController.update);
routes.delete("/delete/:id",authenticateToken, sessionController.delete);



export default routes;