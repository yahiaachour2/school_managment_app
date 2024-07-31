import { CalendarItems } from '../entities/calendarItems';
// import { Student } from '../entities/student';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import { CalendarNotFoundError } from '../errors/CalendarError';
import { InvalidTimeRangeError } from '../errors/scheduleError';
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
      const { itemName, timeStart, timeEnd, description, eventType ,type } = input;

      if (!itemName || !timeStart || !timeEnd || !eventType|| !type) {
        throw new BadParametersError([
          "itemName",
          "timeStart",
          "timeEnd",
          "description",
          "type"
        ]);
      }

      //   const calendarItemSource = await dataSource.getRepository(CalendarItems).findOne({
      //     where: {  itemName  },
      //   });
      //   if (calendarItemSource) {
      //     throw new CalendarAlreadyExistError();
      //   }

      const calendarItem = Object.assign(new CalendarItems(), {
        ...{ itemName, timeStart, timeEnd, description, eventType,type },
      });

      const newCalendarItem = await dataSource
        .getRepository(CalendarItems)
        .save(calendarItem);

      return newCalendarItem;
    } catch (error: any) {
      throw error;
    }
  }

  async createScheduleItem(input: CreateScheduleItemInput) {
    try {
      const {
        timeStart,
        timeEnd,
        userId,
        levelId,
        subjectId,
        roomId,
        type,
      } = input;

      // Check for missing parameters
      if (
        !timeStart ||
        !timeEnd ||
        !userId ||
        !levelId ||
        !subjectId ||
        !roomId||
        !type
      ) {
        throw new BadParametersError([
          "timeStart",
          "timeEnd",
          "levelId",
          "subjectId",
          "userId",
          "roomId",
          "type",

        ]);
      }

      const calendarItemRepository = dataSource.getRepository(CalendarItems);

      // Check if the room is available for the specified time slot using query builder
      const roomConflicts = await calendarItemRepository
        .createQueryBuilder("calendarItem")
        .where("calendarItem.roomId = :roomId", { roomId })
        .andWhere("calendarItem.timeStart < :timeEnd", { timeEnd })
        .andWhere("calendarItem.timeEnd > :timeStart", { timeStart })
        .getMany();

      // if (roomConflicts.length > 0) {
      //   throw new RoomConflictsError();
      // }

      // Check if timeStart is greater than timeEnd
      if (new Date(timeStart) >= new Date(timeEnd)) {
        throw new InvalidTimeRangeError();
      }

      // Create a new calendar item (schedule)
      const calendarItem = Object.assign(new CalendarItems(), {
        timeStart,
        timeEnd,
        type,
        teacher: userId,
        level: levelId,
        subject: subjectId,
        room: roomId,
      });

      const newCalendarItem = await calendarItemRepository.save(calendarItem);

      return newCalendarItem;
    } catch (error: any) {
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

  // async getCalendarsItem(page: number, limit: number, searchType?: string) {
  //   try {
  //     const calendarItemRepository = await dataSource.getRepository(
  //       CalendarItems
  //     );

  //     // Create the query builder for dynamic query
  //     const query = calendarItemRepository
  //       .createQueryBuilder("calendarItem")
  //       .skip((page - 1) * limit)
  //       .take(limit);

  //     // Add type filter if searchType is provided
  //     if (searchType) {
  //       query.andWhere("calendarItem.eventType = :eventType", {
  //         eventType: searchType.trim(),
  //       });
  //     }

  //     // Execute the query
  //     const calendarItems = await query.getMany();

  //     return calendarItems;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async getCalendarsItem(page: number, limit: number, searchType?: string) {
    try {
      const calendarItemRepository = dataSource.getRepository(CalendarItems);
  
      // Log the searchType parameter to check if it's being received correctly
      console.log("searchType:", searchType);
  
      // Create the query builder for dynamic query
      const query = calendarItemRepository
        .createQueryBuilder("calendarItem")
        .leftJoinAndSelect("calendarItem.subject", "subject")
        .leftJoinAndSelect("calendarItem.teacher", "teacher")


        .skip((page - 1) * limit)
        .take(limit);
  
      // Add type filter if searchType is provided
      if (searchType) {
        query.andWhere("calendarItem.type = :type", {
          type: searchType.trim(),
        });
      }
  
      // Execute the query
      const calendarItems = await query.getMany();
  
      // Log the resulting items for debugging
      console.log("calendarItems:", calendarItems);
  
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
