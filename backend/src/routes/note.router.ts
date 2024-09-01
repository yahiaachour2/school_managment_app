import express from 'express';

import { userSubjectNoteController } from '../controllers/note';
import { authenticateToken } from '../Middleware/authVerifier';

const routes = express.Router();


// Route to get students by level and subject using query parameters
routes.get("/students", authenticateToken, userSubjectNoteController.getStudentsByLevelAndSubject);
routes.get("/getnoteforuser", authenticateToken, userSubjectNoteController.getNotesForUser);


// School routes
routes.post("/", authenticateToken, userSubjectNoteController.create);
routes.get("/:id", authenticateToken, userSubjectNoteController.get);
routes.get("/", authenticateToken, userSubjectNoteController.getNotes);
// routes.get("/", authenticateToken, userSubjectNoteController.getNotesForUser);

routes.put("/:noteId", authenticateToken, userSubjectNoteController.update);
routes.delete("/:id", authenticateToken, userSubjectNoteController.delete);

export default routes;
