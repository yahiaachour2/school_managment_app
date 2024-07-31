import express from 'express';

import { levelController } from '../controllers/level';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//room

routes.post("/", authenticateToken,levelController.create);
routes.get("/getOne/:id",authenticateToken, levelController.get);
routes.get("/", authenticateToken,levelController.getLevels);
routes.put("/update/:id",authenticateToken, levelController.update);
routes.delete("/delete/:id",authenticateToken, levelController.delete);

// routes.get('/search', levelController.search);


export default routes;