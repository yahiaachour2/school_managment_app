import { Subject } from '../entities/subject';
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
    // let{ id } = req.params;

    try {
      const { name ,coefficient,scheduleId } = input;
      if (!name || !coefficient) {
        throw new BadParametersError(["name" ,"coefficient"]);
      }

      const subjectSource = await dataSource.getRepository(Subject).findOne({
        where: { name 
        // school: { schoolId }
        },
      });

      if (subjectSource) {
        throw new SubjectAlreadyExistError();
      }

      const subject = Object.assign(new Subject(), {
        ...input,
        schedule :{scheduleId}, // Assign the generated scheduleId

      } as Subject);

      const newSubject = await dataSource.getRepository(Subject).save(subject);

      return newSubject;
    } catch (error: any) {
      throw error ;
    }
  }

  async get(input: GetSubjectInput) {
    const { id } = input;

    let subject;
    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }
      const subjectRepository = dataSource.getRepository(Subject);

      subject = await subjectRepository.findOne({
        where: { subjectId: id },
        relations: ["schedule" ],

      });

      if (!subject) {
        throw new SubjectAlreadyExistError();
      }
    } catch (error: any) {
      throw error
    }

    return  subject
   
  }

  async getSubjects(page: number, limit: number) {
    const subjectRepository = dataSource.getRepository(Subject);
    const Subjects = await subjectRepository.find(

    );

    return  Subjects
  }

  async update(input :updateSubjectInput) {
    const { id: SubjectId } = input;
    const { name , coefficient } = input;
    try {
      if (!uuidValidate(SubjectId)) {
        throw new InvalidUuidError();
      }

      const subjectRepository = dataSource.getRepository(Subject);
      let subject = await subjectRepository.findOne({
        where: { subjectId: SubjectId },
      });

      if (!subject) {
        throw new SubjectNotFoundError();
      }

      const updatedSubject = Object.assign(subject, {
        ...{name ,coefficient},
      } as Subject);

      await subjectRepository.save(updatedSubject);

      return { message: "Update successful" };
    } catch (error: any) {
      throw error
    }
  }

  async delete(input :deleteSubjectInput) {
    const { id } = input;
    try {
      const subjectRepository = dataSource.getRepository(Subject);
      const subject = await subjectRepository.findOne({
        where: { subjectId: id },
      });

      if (!subject) {
        throw new SubjectNotFoundError();
      }

      await subjectRepository.remove(subject);
      return { message: "subject deleted successfully" };
    } catch (error: any) {
      throw error
    }
  }
}

export const subjectService = new SubjectService();
