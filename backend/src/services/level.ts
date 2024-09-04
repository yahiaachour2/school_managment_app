import { Level } from '../entities/level';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import {
  LevelAlreadyExistError,
  LevelNotFoundError,
} from '../errors/LevelError';
import { uuidValidate } from '../helpers/uuid';
import { dataSource } from '../ormconfig';
import {
  CreateLevelInput,
  deleteLevelInput,
  GetLevelInput,
  updateLevelInput,
} from '../types/level';

export class LevelService {
  async create(input: CreateLevelInput) {
    try {
      const { name , scheduleId } = input;

      if (!name) {
        throw new BadParametersError(["name"]);
      }

      const levelSource = await dataSource.getRepository(Level).findOne({
        where: {
            name
        },
      });

      if (levelSource) {
        throw new LevelAlreadyExistError();
      }

      

      
      const level = Object.assign(new Level(), {
        ...input,
        schedule : {scheduleId}


      });

      
      await dataSource.getRepository(Level).save(level);


      const newLevel = await dataSource.getRepository(Level).findOne({
        where: { levelId: level.levelId },
      });

      return newLevel;
    } catch (error: any) {
      throw error;
    }
  }

//   async  search(query: string): Promise<Level[]> {
//     const levelRepository = dataSource.getRepository(Level);
//     console.log(query);
    
//     const levels = await levelRepository.find({
//         where: {
//             name: ILike(`%${query}%`) // Using ILike function for case-insensitive search
//         },
//         take :10
//     });
//     return levels;
// }


   async get(input: GetLevelInput) {
    const { id } = input;

    let level;
    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }
      
      const levelRepository = dataSource.getRepository(Level);
      // level = await levelRepository.createQueryBuilder("level")
      //   .innerJoinAndSelect("level.schedule", "schedule")
      //   .where("level.levelId = :id", { id })
      //   .getOne();
      level = await levelRepository.findOne({
        where:{levelId:id}
      })

      if (!level) {
        throw new LevelNotFoundError();
      }
    } catch (error: any) {
      throw error;
    }

    return level;
  }



  async  getLevels(page: number, limit: number, jj: string = 'rrZS') {
    const levelRepository = dataSource.getRepository(Level);
  
     const query =levelRepository
      .createQueryBuilder('level')
      if(jj){
        query.where('level.name ILIKE :name', { name: `%${jj}%` }) 

      }
      query.skip((page - 1) * limit)
      .take(limit)
      const levels = await query.getMany();
  
    return levels;
  }
  async update(input: updateLevelInput) {
    const {  levelId :id } = input;
    const { name ,levelId} = input;
    try {
      console.log(levelId);
      console.log(input);

      if (!uuidValidate(levelId )) {
        throw new InvalidUuidError();
      }

      const levelRepository = dataSource.getRepository(Level);
      let level = await levelRepository.findOne({
        where: { levelId },
      });

      if (!level) {
        throw new LevelNotFoundError();
      }

      const updateLevel = Object.assign(level, {
        ...{ name, levelId },
      } as Level);

      await levelRepository.save(updateLevel);

      return { message: "Update successful" };
    } catch (error: any) {
      throw error;
    }
  }

  async delete(input: deleteLevelInput) {
    const { id } = input;
    try {
      const levelRepository = dataSource.getRepository(Level);
      const level = await levelRepository.findOne({
        where: { levelId: id },
      });

      if (!level) {
        throw new LevelNotFoundError();
      }
      level.deletedAt = new Date();

      await levelRepository.save(level);
      return { message: "level deleted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export const levelService = new LevelService();
