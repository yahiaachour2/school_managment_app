import {
  Request,
  Response,
} from 'express';

import { userService } from '../services/user';

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.create(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      console.error(error);
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }


  async get(req: Request, res: Response) {
    const { id } = req.params;

    try {

      const user = await userService.get({ id });

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).json({ error: error.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const searchRole = req.query.role as string; // This will capture the role from query params
        const searchLevel = req.query.level as string; // This will capture the role from query params



        const users = await userService.getUsers(page, limit, searchRole,searchLevel);

        return res.status(200).json(users);
    } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
    }
}
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await userService.update({
        id,
       ...req.body
      });
      return res.status(200).json({ message: "Update successful" });
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result  =await userService.delete({ id });
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
}
export const userController = new UserController();
