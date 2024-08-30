import { Level } from '../entities/level';
import { Level_subject } from '../entities/level_subject';
import { Subject } from '../entities/subject';
import { User } from '../entities/user';
import { User_subject } from '../entities/user_subject';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import {
  SubjectAlreadyExistError,
  SubjectNotFoundError,
} from '../errors/SubjectError';
import { uuidValidate } from '../helpers/uuid';
import { dataSource } from '../ormconfig';
import {
  CreateSubjectInput,
  deleteSubjectInput,
  GetSubjectInput,
  updateSubjectInput,
} from '../types/subject';

export class SubjectService {
  async create(input: CreateSubjectInput) {
    try {
      const { name, coefficient, userId, levelIds } = input;
  
      // Validate required fields
      if (!name || !coefficient) {
        throw new BadParametersError(["name", "coefficient"]);
      }
  
      // Check if the subject already exists by name
      const existingSubject = await dataSource.getRepository(Subject).findOne({
        where: { name },
      });
  
      if (existingSubject) {
        throw new SubjectAlreadyExistError();
      }
  
      // Fetch the teacher (or user) associated with this subject
      const teacher = await dataSource.getRepository(User).findOne({
        where: { userId },
        relations: ['level', 'school'],
      });
  
      if (!teacher) {
        throw new Error("Teacher not found.");
      }
  
      // Create a new Subject entity
      const subject = Object.assign(new Subject(), {
        name,
        coefficient,
        user: teacher,  // Assign the teacher to the subject
      });
  
      // Save the subject
      const newSubject = await dataSource.getRepository(Subject).save(subject);
  
      // Create relations for each level in Level_subject
      if (Array.isArray(levelIds) && levelIds.length > 0) {
        for (const levelId of levelIds) {
          const level = await dataSource.getRepository(Level).findOne({ where: { levelId } });
          if (!level) continue;
  
          const levelSubject = Object.assign(new Level_subject(), {
            level,
            subject: newSubject,
          });
  
          await dataSource.getRepository(Level_subject).save(levelSubject);
        }
      }
  
      // Create the relation in User_subject for the teacher and the new subject
      const userSubject = Object.assign(new User_subject(), {
        user: teacher,
        subject: newSubject,
      });
  
      await dataSource.getRepository(User_subject).save(userSubject);
  
      // Return the newly created subject with relations
      return {
        subject: newSubject,
      };
    } catch (error: any) {
      console.error("Error creating subject:", error);
      throw error;
    }
  }
  
  
   async get(input: GetSubjectInput) {
    const { id } = input;

    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }

      const subjectRepository = dataSource.getRepository(Subject);

      // Fetch subject by id
      const subject = await subjectRepository.findOne({
        where: { subjectId: id },
        // relations: ["levelSubjects", "userSubjects"],
      });

      if (!subject) {
        throw new SubjectNotFoundError();
      }

      return subject;
    } catch (error: any) {
      console.error("Error fetching subject:", error);
      throw error;
    }
  }

  async getSubjects(page: number, limit: number) {
    const subjectRepository = dataSource.getRepository(Subject);
    const Subjects = await subjectRepository.find(

    );

    return  Subjects
  }
  async getAllSubjectsWithLevels(page: number, limit: number, levelId?: string) {
    const levelSubjectRepository = dataSource.getRepository(Level_subject);
  
    const query = levelSubjectRepository.createQueryBuilder('levelSubject')
      .leftJoinAndSelect('levelSubject.level', 'level')
      .leftJoinAndSelect('levelSubject.subject', 'subject')
      .take(limit)
      .skip((page - 1) * limit);
  
    // Add a filter by levelId if it exists
    if (levelId) {
      query.where('levelSubject.levelId = :levelId', { levelId });
    }
  
    const levelSubjects = await query.getMany();
  
    // Group the subjects with their associated levels
    const subjectsMap = new Map<string, { subject: any, levels: any[] }>();
  
    levelSubjects.forEach(levelSubject => {
      const subjectId = levelSubject.subject.subjectId;
      if (!subjectsMap.has(subjectId)) {
        subjectsMap.set(subjectId, {
          subject: levelSubject.subject,
          levels: [],
        });
      }
      subjectsMap.get(subjectId)?.levels.push(levelSubject.level);
    });
  
    // Convert the Map to an array of subjects with levels
    const subjectsWithLevels = Array.from(subjectsMap.values());
  
    return subjectsWithLevels;
  }
  
  
  async update(input: updateSubjectInput) {
    const { id: subjectId, name, coefficient, userId, levelId } = input;
  
    try {
      if (!uuidValidate(subjectId)) {
        throw new InvalidUuidError();
      }
  
      const subjectRepository = dataSource.getRepository(Subject);
      const userSubjectRepository = dataSource.getRepository(User_subject);
      const levelSubjectRepository = dataSource.getRepository(Level_subject);
  
      // Fetch the subject to update
      const subject = await subjectRepository.findOne({
        where: { subjectId },
      });
  
      if (!subject) {
        throw new SubjectNotFoundError();
      }
  
      // Update the subject
      const updatedSubject = {
        ...subject,
        name,
        coefficient,
        levelId,
        userId
      };
      await subjectRepository.save(updatedSubject);
  
      // Update or create User_subject relation
      if (userId) {
        let userSubject = await userSubjectRepository.findOne({
          where: {
            subject: { subjectId },
            userId: userId,  // Search by both subjectId and userId
          },
        });
  
        if (userSubject) {
          userSubject.userId = userId;  // Update the existing relation
          await userSubjectRepository.save(userSubject);
        } else {
          userSubject = new User_subject();
          userSubject.userId = userId;
          userSubject.subject = updatedSubject;
          await userSubjectRepository.save(userSubject);
        }
      } else {
        throw new Error('UserId cannot be null');
      }
  
      // Update or create Level_subject relation
      if (levelId) {
        let levelSubject = await levelSubjectRepository.findOne({
          where: {
            subject: { subjectId },
            levelId: levelId,  // Search by both subjectId and levelId
          },
        });
  
        if (levelSubject) {
          levelSubject.levelId = levelId;  // Update the existing relation
          await levelSubjectRepository.save(levelSubject);
        } else {
          levelSubject = new Level_subject();
          levelSubject.levelId = levelId;
          levelSubject.subject = updatedSubject;
          await levelSubjectRepository.save(levelSubject);
        }
      } else {
        throw new Error('LevelId cannot be null');
      }
  
      return { message: "Update successful", subject: updatedSubject };
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  }


  async delete(input: deleteSubjectInput) {
    const { id } = input;

    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }

      const subjectRepository = dataSource.getRepository(Subject);

      const subject = await subjectRepository.findOne({
        where: { subjectId: id },
      });

      if (!subject) {
        throw new SubjectNotFoundError();
      }

      await subjectRepository.remove(subject);

      return { message: "Subject deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  }
}

export const subjectService = new SubjectService();
