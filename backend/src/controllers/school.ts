import {
  Request,
  Response,
} from 'express';

import { schoolService } from '../services/school';

export class SchoolController {
  async create(req: Request, res: Response) {
    try {
      const school = await schoolService.create(req.body);
      return res.status(201).json(school);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const school = await schoolService.get({ id });
      return res.status(200).json(school);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async getSchools(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const schools = await schoolService.getSchools(page, limit);

      return res.status(200).json(schools);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, address } = req.body;

      await schoolService.update({ id, name, address });
      return res.status(200).json({ message: "Update successful" });
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result=await schoolService.delete({ id });
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
}

export const schoolController = new SchoolController();
