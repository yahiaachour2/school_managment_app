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
      const { userId, subjectId, note, levelId } = input;

      if (!userId || !subjectId || !note) {
        throw new BadParametersError(["userId", "subjectId", "note"]);
      }

      //   const schoolSource = await dataSource.getRepository(School).findOne({
      //     where: { canonicalName }, // slugify
      //   });
      //   if (schoolSource) {
      //     throw new SchoolAlreadyExistError();
      //   }

      const user_subject_note = Object.assign(new UserSubjectNoteService(), {
        user: { userId },
        subject: { subjectId },
        note,
        level: { levelId },
      });

      const new_user_subject_note = await dataSource
        .getRepository(UserSubjectNote)
        .save(user_subject_note);

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
        where: { noteId:id },
      });
    } catch (error: any) {
      throw error;
    }

    return note;
  }
  async getNotes(
    subjectId: string,
    levelId: string,
    userId?: string, // Make userId optional
   
  ) {
    try {
      const usersRepository = dataSource.getRepository(User);
  
      const query = usersRepository
        .createQueryBuilder("u")
        .select("u.firstName", "firstName")
        .addSelect("u.lastName", "lastName")
        .addSelect("usn.note", "note")
        .addSelect("u.userId", "userId")
        .addSelect("usn.noteId", "noteId")
        .leftJoin(UserSubjectNote, "usn", "usn.userId = u.userId AND usn.subjectId = :subjectId", { subjectId })
        .where("u.levelId = :levelId", { levelId });
  
  
      const users = await query
        // .skip((page - 1) * limit)
        // .take(limit)
        .getRawMany();
  
      return users;
    } catch (error: any) {
      throw error?.message;
    }
  }
  async getNotesForUser(
    userId: string,
    subjectId?: string
  ) {
    try {
      const usersRepository = dataSource.getRepository(User);
  
      let query = usersRepository
        .createQueryBuilder("u")
        .select("u.firstName", "firstName")
        .addSelect("u.lastName", "lastName")
        .addSelect("usn.note", "note")
        .addSelect("u.userId", "userId")
        .addSelect("usn.noteId", "noteId")
        .addSelect("s.name", "subjectName")
        .addSelect("s.coefficient", "coefficient")

        .leftJoin(UserSubjectNote, "usn", "usn.userId = u.userId")
        .innerJoin(Subject, "s", "s.subjectId = usn.subjectId")
        .where("u.userId = :userId", { userId })
  
   
        // if (subjectId) {
        //  .andWhere("s.subjectId = :subjectId", { subjectId })
        // }

      console.log(query.getQueryAndParameters());
  
      const users = await query.getRawMany();
  
      return users;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }

  async update(input: UpdateuserSubjectNote): Promise<{ message: string }> {
    const { noteId, subjectId, userId, note } = input;
  
    try {
      const userSubjectNoteRepository = dataSource.getRepository(UserSubjectNote);
  
      // Check if noteId is valid
      if (!noteId) {
        throw new Error("Note ID is required");
      }
  
      // Fetch the note by noteId
      let userSubjectNote = await userSubjectNoteRepository.findOne({
        where: { noteId },
      });
  
      // If no note is found, throw an error
      if (!userSubjectNote) {
        throw new NoteNotFoundError();
      }
  
      // // Validate the note value (example: ensure it's within a valid range)
      // if (note < 0 || note > 20) {
      //   throw new Error("Note must be between 0 and 20");
      // }
  
      // Update the note
      Object.assign(userSubjectNote, {
        note,
      });
  
      // Save the updated note
      await userSubjectNoteRepository.save(userSubjectNote);
  
      return { message: "Update successful" };
    } catch (error: any) {
      console.error("Error updating note:", error);
      throw new Error("Failed to update note");
    }
  }
  async getStudentsByLevelAndSubject(levelId: string, subjectId: string) {
    try {
      const userRepository = dataSource.getRepository(User);
      console.log("levelId", levelId);
      console.log("subjectId", subjectId);
      const students = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.userSubjectNotes", "userSubjectNote")
        .leftJoinAndSelect("userSubjectNote.subject", "subject")
        .where("user.levelId = :levelId", { levelId })
        .andWhere("userSubjectNote.subjectId = :subjectId", { subjectId })
        .getMany();
    
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

      const userSubjectNoteRepository =
        dataSource.getRepository(UserSubjectNote);

      const userSubjectNote = await userSubjectNoteRepository.findOne({
        where: { noteId:id },
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
