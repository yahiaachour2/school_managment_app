import Calendar from '../entities/calendar';
// import { Student } from '../entities/student';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import {
  CalendarAlreadyExistError,
  CalendarNotFoundError,
} from '../errors/CalendarError';
import { uuidValidate } from '../helpers';
import { dataSource } from '../ormconfig';
import {
  CreateCalendarInput,
  deleteCalendarInput,
  getCalendarInput,
  updateCalendarInput,
} from '../types/calendar';

export class CalendarService {
  async create(input: CreateCalendarInput) {
    try {
      const { calendarName } = input;

      if (!calendarName ) {
        throw new BadParametersError(["name"]);
      }

      const calendarSource = await dataSource.getRepository(Calendar).findOne({
        where: {  calendarName  },
      });
      if (calendarSource) {
        throw new CalendarAlreadyExistError();
      }

      const calendar = Object.assign(new Calendar(), {
        calendarName,
        
      });

      const newCalendar = await dataSource.getRepository(Calendar).save(calendar);

      return newCalendar;
    } catch (error: any) {
      throw error;
    }
  }

  async get(input: getCalendarInput) {
    const { id } = input;

    try {
      const calendarRepository = dataSource.getRepository(Calendar);

      const calendar = await calendarRepository.findOne({
        where: { calendarId: id },

        // relations: ['rooms', 'sessions', 'users'] // Include relations as needed

      });

      if (!calendar) {
         throw new CalendarNotFoundError;
      }

      return calendar;
    } catch (error) {
      throw error;
    }
  }
//   // async get(input: getSchoolInput) {
//   //   const { id } = input;

//   //   try {
//   //     const school = await dataSource
//   //       .getRepository(School)
//   //       .createQueryBuilder("school")
//   //       .leftJoinAndSelect("school.rooms", "room")
//   //       .leftJoinAndSelect("school.sessions", "session")
//   //       .leftJoinAndSelect("school.users", "user", "user.role = :role", {
//   //         role: UserRoles.PARENT,
//   //       })
//   //       .leftJoinAndMapMany(
//   //         "user.students",
//   //         // Student,
//   //         "student",
//   //         "student.parentId = user.userId"
//   //       )
//   //       .where("school.schoolId = :schoolId", { schoolId: id })
//   //       .getOne();

//   //     if (!school) {
//   //       throw new SchoolNotFoundError();
//   //     }

//   //     return school;
//   //   } catch (error) {
//   //     throw error;
//   //   }
//   // }

  async getCalendars(page: number, limit: number) {
    try {
      const schoolRepository = await dataSource.getRepository(Calendar);

      const schools = await schoolRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });

      return schools;
    } catch (error) {
      throw error;
    }
  }
//   // async getSchools(page: number, limit: number) {
//   //   try {
//   //     const schools = await dataSource.getRepository(School)
//   //       .createQueryBuilder('school')
//   //       .leftJoinAndSelect('school.rooms', 'room')
//   //       .leftJoinAndSelect('school.sessions', 'session')
//   //       .leftJoinAndSelect('school.users', 'user', 'user.role = :role', { role: UserRoles.PARENT })
//   //       .leftJoinAndMapMany('user.students', Student, 'student', 'student.parentId = user.userId')
//   //       .skip((page - 1) * limit)
//   //       .take(limit)
//   //       .getMany();
//   //       console.log(schools);

//   //     return schools;
//   //     console.log(schools);

//   //   } catch (error) {
//   //     console.log(error);

//   //     throw error;
//   //   }
//   // }

async  update(input: updateCalendarInput) {
  const { calendarName, id: calendarId } = input;

  try {
    if (!uuidValidate(calendarId)) {
      throw new InvalidUuidError();
    }

    const calendarRepository = dataSource.getRepository(Calendar);
    let calendar = await calendarRepository.findOne({
      where: { calendarId },
    });

    if (!calendar) {
      throw new CalendarNotFoundError();
    }

    calendar = Object.assign(calendar, {
      ...{calendarName} ,
    });

    await calendarRepository.save(calendar);

    return { message: "Update successful" };
  } catch (error: any) {
    throw error;
  }
}

  async delete(input: deleteCalendarInput) {
    const { id } = input;
    try {
      const calendarRepository = dataSource.getRepository(Calendar);
      const calendar = await calendarRepository.findOne({
        where: { calendarId: id },
      });

      if (!calendar) {
        throw new CalendarNotFoundError();
      }

      await calendarRepository.remove(calendar);
      return { message: "calendar deleted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export const calendarService = new CalendarService();
