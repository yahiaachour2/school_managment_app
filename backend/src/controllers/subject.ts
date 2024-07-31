import {
  Request,
  Response,
} from 'express';

import { subjectService } from '../services/subject';

export class SubjectController {
  async create(req: Request, res: Response) {
    try {
      console.log("Received input:", req.body);

      const subject = await subjectService.create(req.body);

      return res.status(201).json(subject);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const subject = await subjectService.get({ id });

      return res.status(201).json(subject);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async getSubjects(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const subjects = await subjectService.getSubjects(page, limit);

      return res.status(200).json(subjects);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, coefficient } = req.body;

      await subjectService.update({ id, name, coefficient });
      return res.status(200).json({ message: "Update successful" });
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

     const result= await subjectService.delete({ id });
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
}
export const subjectController = new SubjectController();
