import {
  Request,
  Response,
} from 'express';

import { calendarService } from '../services/calendar';

export class CalendarController {
    async create(req: Request, res: Response) {
      try {
        const calendar = await calendarService.create(req.body);
        return res.status(201).json(calendar);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async get(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const calendar = await calendarService.get({ id });
        return res.status(200).json(calendar);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async getCalendars(req: Request, res: Response) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
  
        const calendars = await calendarService.getCalendars(page, limit);
  
        return res.status(200).json(calendars);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async update(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const { calendarName } = req.body;
  
        await calendarService.update({ id, calendarName });
        return res.status(200).json({ message: "Update successful" });
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async delete(req: Request, res: Response) {
      try {
        const { id } = req.params;
  
        const result=await calendarService.delete({ id });
        return res.status(200).json(result);
      } catch (error: any) {
        console.log(error);
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  }
  
  export const calendarController = new CalendarController();
  