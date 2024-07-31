import { School } from '../entities/school';
import { Session } from '../entities/session';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import { SchoolNotFoundError } from '../errors/SchoolError';
import { SessionNotFoundError } from '../errors/SessionErrors';
import { uuidValidate } from '../helpers/uuid';
//   import { Session } from '../entities/session';
import { dataSource } from '../ormconfig';
import {
  CreateSessionInput,
  deleteSessionInput,
  GetSessionInput,
  UpdateSessionInput,
} from '../types/session';

export class SessionService {
  // async create(req: Request, res: Response) {
  //     let{ id } = req.body;

  //     try {
  //       const {StartDate, FinDate, schoolId } = req.body;
  //       if (!StartDate || !FinDate || !schoolId) {
  //         throw new BadParametersError(["StartDate", "FinDate", "schoolId"]);
  //       }

  //       const sessionSource = await dataSource.getRepository(Session).findOne({
  //         where: {schoolId :id },
  //       });

  //       if (!sessionSource) {
  //         throw new SessionAlreadyExistError();
  //       }

  //       const session = Object.assign(new Session(), {
  //         ...req.body,

  //       } as Session);

  //       const newSession = await dataSource.getRepository(Session).save(session);

  //       return res.status(201).json(newSession);
  //     } catch (error: any) {
  //       console.log(error);

  //       return res.status(error?.httpStatusCode || 500).send(error);
  //     }
  //   }

  async create(input: CreateSessionInput) {
    try {
      const { StartDate, FinDate, schoolId } = input;
      if (!StartDate || !FinDate || !schoolId) {
        throw new BadParametersError(["StartDate", "FinDate", "schoolId"]);
      }
      const existingSchool = await dataSource
        .getRepository(School)
        .findOne({ where: { schoolId } });
      if (!existingSchool) {
        throw new SchoolNotFoundError();
      }

      const startDate = new Date(StartDate); // Parse StartDate string to Date object
      const finDate = new Date(FinDate); // Parse FinDate string to Date object

      const existingSession = await dataSource.getRepository(Session).findOne({
        where: {
          StartDate: startDate, // Use parsed StartDate
          FinDate: finDate, // Use parsed FinDate
          school: { schoolId: existingSchool.schoolId },
        },
      });

      if (existingSession) {
        throw new Error(
          "A session with the same StartDate and FinDate already exists."
        );
      }

      const session = Object.assign(new School(), {
        StartDate: startDate, // Use parsed StartDate
        FinDate: finDate, // Use parsed FinDate
        school: existingSchool,
      });

      const newSession = await dataSource.getRepository(Session).save(session);

      return newSession;
    } catch (error: any) {
      console.log(error);

      return error.message || "Internal Server Error";

    }
    
  }

  async get(input: GetSessionInput) {
    const { id } = input;

    let session;
    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }
      const sessionRepository = dataSource.getRepository(Session);

      session = await sessionRepository.findOne({
        where: { SessionId: id },
      });

      if (!session) {
        throw new SessionNotFoundError();
      }
    } catch (error: any) {
      throw error;
    }

    return {
      session,
    };
  }

  async getSessions(page: number , limit: number) {
    try {
    const sessionRepository = dataSource.getRepository(Session);
    const Sessions = await sessionRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return Sessions} catch (error) {
      throw error;
    }
   
  }

  async update(input :UpdateSessionInput ) {
    const { id: SessionId } = input;
    const { StartDate, FinDate, schoolId } =input;
    try {
      if (!uuidValidate(SessionId)) {
        throw new InvalidUuidError();
      }

      const sessionRepository = dataSource.getRepository(Session);
      let session = await sessionRepository.findOne({
        where: { SessionId },
      });

      if (!session) {
        throw new SessionNotFoundError();
      }

      const updatedSession = Object.assign(session, {
        ...{StartDate,FinDate,schoolId},
      } as Session);

      await sessionRepository.save(updatedSession);

      return { message: "Update successful" };
    } catch (error: any) {
     throw error
    }
  }

  async delete(input : deleteSessionInput) {
    const { id } = input;
    try {
      const sessionRepository = dataSource.getRepository(Session);
      const session = await sessionRepository.findOne({
        where: { SessionId: id },
      });

      if (!session) {
        throw new SessionNotFoundError();
      }

      await sessionRepository.remove(session);
      return { message: "session deleted successfully" };
    } catch (error: any) {
     throw error
    }
  }
}

export const sessionService = new SessionService();
