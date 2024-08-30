import { Subject } from '../entities/subject';
import { User } from '../entities/user';
import { UserSubjectNote } from '../entities/userSubjectNote ';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import { NoteNotFoundError } from '../errors/NoteError';
import { uuidValidate } from '../helpers';
import { dataSource } from '../ormconfig';
import {
  CreateuserSubjectNote,
  GetuserSubjectNote,
  UpdateuserSubjectNote,
} from '../types/userSubjectNote';

export class UserSubjectNoteService {
  
   async create(input: CreateuserSubjectNote) {
    try {
      const { userId, subjectId, note } = input;

      if (!userId || !subjectId|| !note) {
        throw new BadParametersError(["userId", "subjectId", "note"]);
      }
      

    //   const schoolSource = await dataSource.getRepository(School).findOne({
    //     where: { canonicalName }, // slugify
    //   });
    //   if (schoolSource) {
    //     throw new SchoolAlreadyExistError();
    //   }

      const user_subject_note = Object.assign(new UserSubjectNoteService(), {
        user :{userId},
        subject:{subjectId},
        note,
      });

      const new_user_subject_note = await dataSource.getRepository(UserSubjectNote).save(user_subject_note);

      return new_user_subject_note;
    } catch (error: any) {
      throw error;
    }
  }
  async get(input: GetuserSubjectNote) {
    const { id } = input;

    let note;
    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }
      const noteRepository = dataSource.getRepository(UserSubjectNote);

      note = await noteRepository.findOne({
        where: {  id },
      });

     
    } catch (error: any) {
      throw error;
    }

    return note;
  }
  async getNotes(page: number , limit: number) {
    try {
    const userSubjectNoteRepository = dataSource.getRepository(UserSubjectNote);
    const notes = await userSubjectNoteRepository.find({
         relations: ["user", 'subject'],

      skip: (page - 1) * limit,
      take: limit,
    });

    return notes} catch (error) {
      throw error;
    }
}
   
async update(input: UpdateuserSubjectNote) {
  const { id, subjectId, userId, note } = input;

  try {
  

    const userSubjectNoteRepository = dataSource.getRepository(UserSubjectNote);
    const userRepository = dataSource.getRepository(User);
    const subjectRepository = dataSource.getRepository(Subject);

    let userSubjectNote = await userSubjectNoteRepository.findOne({
      where: { id },
    });
    if (!userSubjectNote) {
      throw new NoteNotFoundError();
    }

    // Fetch the associated User and Subject entities
    const user = await userRepository.findOne({ where: { userId } });
    const subject = await subjectRepository.findOne({ where: { subjectId } });

    if (!user || !subject) {
      throw new Error("User or Subject not found");
    }

    // Use Object.assign to update the properties
    Object.assign(userSubjectNote, {
      note, 
      user, 
      subject
    });

    // Save the updated entity
    await userSubjectNoteRepository.save(userSubjectNote);

    return { message: "Update successful" };
  } catch (error: any) {
    throw error;
  }
}
async getStudentsByLevelAndSubject(levelId: string, subjectId: string) {
  try {
    const userRepository = dataSource.getRepository(User);
    console.log("levelId",levelId);
    console.log("subjectId",subjectId);
    const students = await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userSubjectNotes', 'userSubjectNote')
      .leftJoinAndSelect('userSubjectNote.subject', 'subject')
      .where('user.levelId = :levelId', { levelId })
      .andWhere('userSubjectNote.subjectId = :subjectId', { subjectId })
      .getMany();
      console.log("levelId",levelId);
      console.log("subjectId",subjectId);
    return students;
  } catch (error: any) {
    throw error;
  }
}


async delete(id: string) {
  try {
    if (!uuidValidate(id)) {
      throw new InvalidUuidError();
    }

    const userSubjectNoteRepository = dataSource.getRepository(UserSubjectNote);

    const userSubjectNote = await userSubjectNoteRepository.findOne({
      where: { id },
    });

    if (!userSubjectNote) {
      throw new NoteNotFoundError();
    }

    await userSubjectNoteRepository.remove(userSubjectNote);

    return { message: "Note deleted successfully" };
  } catch (error: any) {
    throw error;
  }
}
}
export const userSubjectNoteService = new UserSubjectNoteService();

