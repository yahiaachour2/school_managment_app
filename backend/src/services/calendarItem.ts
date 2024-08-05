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
  async create(input: CreateCalendarItemInput) {
    try {
      const { itemName, timeStart, timeEnd, description, eventType, type } =
        input;

      if (!itemName || !timeStart || !timeEnd || !eventType || !type) {
        throw new BadParametersError([
          "itemName",
          "timeStart",
          "timeEnd",
          "description",
          "type",
        ]);
      }

      //   const calendarItemSource = await dataSource.getRepository(CalendarItems).findOne({
      //     where: {  itemName  },
      //   });
      //   if (calendarItemSource) {
      //     throw new CalendarAlreadyExistError();
      //   }

      const calendarItem = Object.assign(new CalendarItems(), {
        ...{ itemName, timeStart, timeEnd, description, eventType, type },
      });

      const newCalendarItem = await dataSource
        .getRepository(CalendarItems)
        .save(calendarItem);

      return newCalendarItem;
    } catch (error: any) {
      throw error;
    }
  }
  async getCalendarsItemsSchdule(page: number, limit: number,searchType?: string) {
    try {
      const calendarRepository = await dataSource.getRepository(CalendarItems);

      const query = calendarRepository
      .createQueryBuilder("calendarItem")
    


      .skip((page - 1) * limit)
      .take(limit);

    if (searchType) {
      query.andWhere("calendarItem.type = :type", { type: searchType.trim() });
    }
      const calendars = await query.getMany();

      return calendars;
    } catch (error) {
      throw error;
    }
  }
  

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

  async getCalendarsItem(page: number, limit: number, searchType?: string, userId?: string, levelId?: string) {
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
