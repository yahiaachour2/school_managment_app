import {
  Request,
  Response,
} from 'express';

import { calendarItemService } from '../services/calendarItem';

export class CalendarItemController {
//calendar

      async create(req: Request, res: Response) {
        try {
          const calendarItem = await calendarItemService.create(req.body);
          return res.status(201).json(calendarItem);
        } catch (error: any) {
          return res.status(error?.httpStatusCode || 500).send(error);
        }
      }
//secedule

      async getScheduleItem(req: Request, res: Response) {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 20;
          const searchType = req.query.type as string;
          const userId = req.query.userId as string;
          const levelId = req.query.levelId as string;
      
          const calendarsItem = await calendarItemService.getScheduleItem(page, limit, searchType,userId,levelId);
      
          return res.status(200).json(calendarsItem);
        } catch (error: any) {
          return res.status(error?.httpStatusCode || 500).send(error);
        }
      }
//secedule

      async createScheduleItem(req: Request, res: Response) {
        try {
          const scheduleItem = await calendarItemService.createScheduleItem(req.body);
          return res.status(201).json(scheduleItem);
        } catch (error: any) {
          return res.status(error?.httpStatusCode || 500).send(error);
        }
      }
      //calendar

      async getCalendarsItems(req: Request, res: Response) {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 20;
          const searchType = req.query.type as string;
          const userId = req.query.userId as string;
          const eventType = req.query.eventType as string;

      
          const calendars = await calendarItemService.getCalendarsItems(page, limit, searchType, userId,eventType);
      
          return res.status(200).json(calendars);
        } catch (error: any) {
          return res.status(error?.httpStatusCode || 500).send(error);
        }
      }
      async get(req: Request, res: Response) {
        try {
          const { id } = req.params;
          const calendarItem = await calendarItemService.get({ id });
          return res.status(200).json(calendarItem);
        } catch (error: any) {
          return res.status(error?.httpStatusCode || 500).send(error);
        }
      }
    
      async update(req: Request, res: Response) {
        try {
          const { id } = req.params;
          const { itemName, timeStart, timeEnd, description, type } = req.body;
    
          await calendarItemService.update({ calendarItemId: id, itemName, timeStart, timeEnd, description });
          return res.status(200).json({ message: "Update successful" });
        } catch (error: any) {
          return res.status(error?.httpStatusCode || 500).send(error);
        }
      }
      async delete(req: Request, res: Response) {
        try {
          const { id } = req.params;
    
          const result=await calendarItemService.delete({ id });
          return res.status(200).json(result);
        } catch (error: any) {
          console.log(error);
          return res.status(error?.httpStatusCode || 500).send(error);
        }
      }
    }
    
    export const calendarItemController = new CalendarItemController();
    