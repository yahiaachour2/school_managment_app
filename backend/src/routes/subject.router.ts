import express from 'express';

import { subjectController } from '../controllers/subject';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();
//room

routes.post("/",authenticateToken, subjectController.create);
routes.get("/getOne/:id",authenticateToken, subjectController.get);
routes.get("/",authenticateToken, subjectController.getSubjects);
routes.get("/getLevelsForSubject/",authenticateToken, subjectController.getAllSubjectsWithLevels);

routes.put("/update/:id",authenticateToken, subjectController.update);
routes.delete("/delete/:id",authenticateToken, subjectController.delete);



export default routes;