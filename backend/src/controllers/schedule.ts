import {
  Request,
  Response,
} from 'express';

import { scheduleService } from '../services/schedule';

export class ScheduleController {
    async create(req: Request, res: Response) {
      try {
        const schedule = await scheduleService.create(req.body);
        return res.status(201).json(schedule);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async get(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const schedule = await scheduleService.get({ id });
        return res.status(200).json(schedule);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async getSchedules(req: Request, res: Response) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
  
        const schedules = await scheduleService.getSchedules(page, limit);
  
        return res.status(200).json(schedules);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async update(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const { dayOfWeek, startTime, endTime } = req.body;
  
        const schedule = await scheduleService.update({id , dayOfWeek, startTime, endTime} );
        return res.status(200).json({ schedule, message: "Update successful" });
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async delete(req: Request, res: Response) {
      try {
        const { id } = req.params;
  
        const result =await scheduleService.delete({ id });
        return res.status(200).json(result);
      } catch (error: any) {
        console.log(error);
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
    
  }
  
  export const scheduleController = new ScheduleController();
  