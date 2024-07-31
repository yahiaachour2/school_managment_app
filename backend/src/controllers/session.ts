import {
  Request,
  Response,
} from 'express';

import { sessionService } from '../services/session';

export class SessionController {
  async create(req: Request, res: Response) {
    try {
      console.log("Received input:", req.body);

      const session = await sessionService.create(req.body);

      return res.status(201).json(session);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const session = await sessionService.get({ id });

      return res.status(201).json(session);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async getSessions(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const sessions = await sessionService.getSessions(page, limit);

      return res.status(200).json(sessions);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { StartDate, FinDate, schoolId } = req.body;

      const session = await sessionService.update(req.body);
      return res.status(200).json({ session, message: "Update successful" });
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result= await sessionService.delete({ id });
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
}
export const sessionController = new SessionController();
