import {
  Request,
  Response,
} from 'express';

import { levelService } from '../services/level';

export class LevelController {
    async create(req: Request, res: Response) {
      try {
        const level = await levelService.create(req.body);
        console.log("Received input:",req.body);
        return res.status(201).json(level);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async get(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const level = await levelService.get({ id });
        return res.status(200).json(level);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
  
    async getLevels(req: Request, res: Response) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 111;
        const fullSearchText = req.query.fullSearchText as string || ''; 
    
    
    
        const levels = await levelService.getLevels(page, limit, fullSearchText); 
    
        return res.status(200).json(levels);
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
    
  
    async update(req: Request, res: Response) {
      try {
        const { id } = req.params;
        const { name} = req.body;
  
        const level = await levelService.update({name, levelId:id});
        return res.status(200).json({  message: "Update successful" });
      } catch (error: any) {
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
    // async search(req: Request, res: Response) {
    //   try {
    //     const query = req.query.q as string;
    //     const levels = await levelService.search(query);
    //     return res.status(200).json(levels);
    //   } catch (error: any) {
    //     return res.status(error?.httpStatusCode || 500).send(error);
    //   }
    // }
  
 
        
    async delete(req: Request, res: Response) {
      try {
        const { id } = req.params;
  
        const result = await levelService.delete({ id });
        return res.status(200).json(result);
      } catch (error: any) {
        console.log(error);
        return res.status(error?.httpStatusCode || 500).send(error);
      }
    }
    //
  }
  
  export const levelController = new LevelController();
  