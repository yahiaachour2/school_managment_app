import {
  Request,
  Response,
} from 'express';

import { roomService } from '../services/room';

export class RoomController {
  async create(req: Request, res: Response) {
    try {
      const room = await roomService.create(req.body);
      return res.status(201).json(room);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const room = await roomService.get({ id });
      return res.status(200).json(room);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
  //  getAvailableRooms = async (req: Request, res: Response) => {
  //   const { timeStart, timeEnd } = req.query;
  
  //   if (!timeStart || !timeEnd) {
  //     return res.status(400).json({ message: 'Missing timeStart or timeEnd parameter' });
  //   }
  
  //   const roomRepository = getCustomRepository(RoomRepository);
  //   const availableRooms = await roomRepository.findAvailableRooms(new Date(timeStart as string), new Date(timeEnd as string));
  
  //   res.json(availableRooms);
  // };
  async getAvailableRooms(req: Request, res: Response) {
    try {
      const { timeStart, timeEnd } = req.query;
  
      if (!timeStart || !timeEnd) {
        return res.status(400).json({ message: 'Missing timeStart or timeEnd parameter' });
      }
  
      const availableRooms = await roomService.findAvailableRooms(new Date(timeStart as string), new Date(timeEnd as string));
  console.log("findAvailableRooms",availableRooms);
  
      return res.json(availableRooms);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async getRooms(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const rooms = await roomService.getRooms(page, limit);

      return res.status(200).json(rooms);
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, address } = req.body;

      const room = await roomService.update(req.body);
      return res.status(200).json({ room, message: "Update successful" });
    } catch (error: any) {
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result=await roomService.delete({ id });
      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(error?.httpStatusCode || 500).send(error);
    }
  }
  //
}

export const roomController = new RoomController();
