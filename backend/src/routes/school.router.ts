import express from 'express';

import { schoolController } from '../controllers/school';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//school

routes.post("/",authenticateToken, schoolController.create);
routes.get("/getOne/:id",authenticateToken, schoolController.get);
routes.get("/",authenticateToken,authenticateToken, schoolController.getSchools);
routes.put("/update/:id",authenticateToken, schoolController.update);
routes.delete("/delete/:id",authenticateToken, schoolController.delete);
export default routes;