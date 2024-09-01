import { CalendarItems } from '../entities/calendarItems';
import { Level } from '../entities/level';
import { Room } from '../entities/room';
import { Subject } from '../entities/subject';
import { User } from '../entities/user';
// import { Student } from '../entities/student';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import { CalendarNotFoundError } from '../errors/CalendarError';
import {
  InvalidTimeRangeError,
  RoomConflictsError,
} from '../errors/scheduleError';
import { uuidValidate } from '../helpers';
import { dataSource } from '../ormconfig';
import {
  CreateCalendarItemInput,
  CreateScheduleItemInput,
  deleteCalendarItemInput,
  getCalendarItemInput,
  updateCalendarItemInput,
} from '../types/calendarItem';

export class CalendarItemService {
//calendaar
async create(input: CreateCalendarItemInput) {
  try {
    const { itemName, timeStart, timeEnd, description, eventType, type, userId, subjectId, studentId } = input;

    if (!timeStart || !timeEnd || !eventType || !type) {
      throw new BadParametersError(["timeStart", "timeEnd", "eventType", "type"]);
    }

    // Prepare calendar item
    const calendarItem = Object.assign(new CalendarItems(), {
      itemName,
      timeStart,
      timeEnd,
      description,
      eventType,
      type,
      subject: { subjectId } as Subject,
      teacher: { userId } as User,
      student: studentId ? { userId: studentId } as User : undefined  // Handle studentId if provided
    });

    const newCalendarItem = await dataSource.getRepository(CalendarItems).save(calendarItem);

    return newCalendarItem;
  } catch (error: any) {
    console.error('Error creating calendar item:', error);
    throw error;
  }
}
  //schedule
  async getScheduleItem(page: number, limit: number, searchType?: string, userId?: string, levelId?: string) {
    try {
      const calendarItemRepository = dataSource.getRepository(CalendarItems);
  
     


    if (!userId && !levelId) {
      return [];
    }

      const query = calendarItemRepository
        .createQueryBuilder("calendarItem")
        .leftJoinAndSelect("calendarItem.subject", "subject")
        .leftJoinAndSelect("calendarItem.teacher", "teacher")
        .leftJoinAndSelect("calendarItem.level", "level")
        .leftJoinAndSelect("calendarItem.room", "room")



        .skip((page - 1) * limit)
        .take(limit);
  
      if (searchType) {
        query.andWhere("calendarItem.type = :type", { type: searchType.trim() });
      }
      if (levelId) {
        query.andWhere("calendarItem.levelId = :levelId", { levelId });
      }
  
      if (userId) {
        query.andWhere("calendarItem.teacher.userId = :userId", { userId });
      }
  
      
  
      const calendarItems = await query.getMany();
  
      return calendarItems;
    } catch (error) {
      throw error;
    }
  }

//calendar
async getCalendarsItems(page: number, limit: number, searchType?: string, userId?: string, eventType?: string) {
  try {
    const calendarRepository = await dataSource.getRepository(CalendarItems);

    const query = calendarRepository
      .createQueryBuilder("calendarItem")
      .leftJoinAndSelect("calendarItem.subject", "subject")
      .leftJoinAndSelect("calendarItem.student", "student")
      .skip((page - 1) * limit)
      .take(limit);

    if (searchType) {
      query.andWhere("calendarItem.type = :type", { type: searchType.trim() });
    }

    if (userId) {
      query.andWhere("student.userId = :userId", { userId });
    }
    if (eventType) {
      query.andWhere("calendarItem.eventType = :eventType", { eventType });
    }
    const calendars = await query.getMany();

    return calendars;
  } catch (error) {
    throw error;
  }
}

  
//secedule

  async createScheduleItem(input: CreateScheduleItemInput) {
    try {
      const { timeStart, timeEnd, subjectId, roomId, userId, levelId, type } = input;

      // Check for missing parameters
      if (!timeStart || !timeEnd || !subjectId || !roomId || !type) {
        throw new BadParametersError([
          "timeStart",
          "timeEnd",
          "subjectId",
          "roomId",
          "type",
        ]);
      }

      const calendarItemRepository = dataSource.getRepository(CalendarItems);
      const userRepository = dataSource.getRepository(User);

      // Check if the room is available for the specified time slot
      const roomConflicts = await calendarItemRepository
        .createQueryBuilder("calendarItem")
        .where("calendarItem.roomId = :roomId", { roomId })
        .andWhere("calendarItem.timeStart < :timeEnd", { timeEnd })
        .andWhere("calendarItem.timeEnd > :timeStart", { timeStart })
        .getMany();

      // Uncomment this if you want to handle room conflicts
      if (roomConflicts.length > 0) {
        throw new RoomConflictsError();
      }

      if (new Date(timeStart) >= new Date(timeEnd)) {
        throw new InvalidTimeRangeError();
      }

      // Fetch the user entity
      const user = await userRepository.findOneBy({ userId });

      if (!user) {
        throw new Error('User not found');
      }

      // Create a new calendar item (schedule)
      const calendarItem = Object.assign(new CalendarItems(), {
        timeStart,
        timeEnd,
        teacher: user, // Assign the User entity
        level: { levelId } as Level, // Ensure Level entity is correctly assigned
        subject: {subjectId } as Subject, // Ensure Subject entity is correctly assigned
        room: { roomId } as Room, // Ensure Room entity is correctly assigned
        type,
      });

      const newCalendarItem = await calendarItemRepository.save(calendarItem);

      return newCalendarItem;
    } catch (error: any) {
      console.error('Error creating schedule item:', error);
      throw error;
    }
  }
  async get(input: getCalendarItemInput) {
    const { id } = input;

    try {
      const calendarItemRepository = dataSource.getRepository(CalendarItems);

      const calendarItem = await calendarItemRepository.findOne({
        where: { calendarItemId: id },

        // relations: ['rooms', 'sessions', 'users'] // Include relations as needed
      });

      if (!calendarItem) {
        throw new CalendarNotFoundError();
      }

      return calendarItem;
    } catch (error) {
      throw error;
    }
  }

 
  async update(input: updateCalendarItemInput) {
    const {
      calendarItemId,
      itemName,
      timeStart,
      timeEnd,
      description,
      eventType,
      
    } = input;

    try {
      if (!uuidValidate(calendarItemId)) {
        throw new InvalidUuidError();
      }

      const calendarItemRepository = dataSource.getRepository(CalendarItems);
      let calendarItem = await calendarItemRepository.findOne({
        where: { calendarItemId },
      });

      if (!calendarItem) {
        throw new CalendarNotFoundError();
      }

      calendarItem = Object.assign(calendarItem, {
        itemName,
        timeStart,
        timeEnd,
        description,
        eventType,
      });

      await calendarItemRepository.save(calendarItem);

      return { message: "Update Item successful" };
    } catch (error: any) {
      throw error;
    }
  }

  async delete(input: deleteCalendarItemInput) {
    const { id } = input;
    try {
      const calendarItemRepository = dataSource.getRepository(CalendarItems);
      const calendarItem = await calendarItemRepository.findOne({
        where: { calendarItemId: id },
      });

      if (!calendarItem) {
        throw new CalendarNotFoundError();
      }

      await calendarItemRepository.remove(calendarItem);
      return { message: "calendar Item deleted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export const calendarItemService = new CalendarItemService();
