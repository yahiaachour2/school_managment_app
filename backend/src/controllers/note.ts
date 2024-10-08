import {
  Request,
  Response,
} from 'express';

import { userSubjectNoteService } from '../services/note';

export class UserSubjectNoteController {
  // Create a new note
  async create(req: Request, res: Response) {
    try {
      const note = await userSubjectNoteService.create(req.body);
      return res.status(201).json(note);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const room = await userSubjectNoteService.get({ id });
      return res.status(200).json(room);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  // Get all notes
  async getNotes(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const levelId = req.query.levelId as string;
      const subjectId = req.query.subjectId as string;
      const userId = req.query.userId as string;
      
      const sessions = await userSubjectNoteService.getNotes(
        subjectId,
        levelId,
        userId,
      
      );

      return res.status(200).json(sessions);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
    // Get all notes
    async getNotesForUser(req: Request, res: Response) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
  
        const levelId = req.query.levelId as string;
        const subjectId = req.query.subjectId as string;
        const userId = req.query.userId as string;
        console.log("ssssssssssss");

        const sessions = await userSubjectNoteService.getNotesForUser(
          userId,
        
        
        );
  console.log("ssssssssssss");
  
        return res.status(200).json(sessions);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  async update(req: Request, res: Response) {
    try {
      const { noteId } = req.params; // Extract noteId from URL
      const { note, subjectId, userId } = req.body; // Extract the other details from the body
  
    
  
      const updatedSubject = await userSubjectNoteService.update({
        noteId,
        subjectId,
        userId,
        note,
      });
  
      return res.status(200).json({ updatedSubject, message: "Update successful" });
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
  async getStudentsByLevelAndSubject(req: Request, res: Response) {
    try {
      const { levelId, subjectId } = req.query;

      if (!levelId || !subjectId) {
        return res
          .status(400)
          .json({ message: "Level ID and Subject ID are required" });
      }

      const students =
        await userSubjectNoteService.getStudentsByLevelAndSubject(
          levelId as string,
          subjectId as string
        );
      return res.status(200).json(students);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await userSubjectNoteService.delete(id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
}

// Export the instance
export const userSubjectNoteController = new UserSubjectNoteController();
