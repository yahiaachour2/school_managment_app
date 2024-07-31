import { Room } from '../entities/room';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import {
  InvalidStatusError,
  RoomAlreadyExistError,
  RoomNotFoundError,
} from '../errors/RoomError';
import { uuidValidate } from '../helpers/uuid';
import { dataSource } from '../ormconfig';
import {
  CreateRoomInput,
  deleteRoomInput,
  GetRoomInput,
  RoomStatus,
  updateRoomInput,
} from '../types/room';

export class RoomService {

  async findAvailableRooms(timeStart: Date, timeEnd: Date) {
    try {
      const rooms = await dataSource
        .getRepository(Room)
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.calendarItems', 'calendarItems')
        .where('calendarItems.timeStart NOT BETWEEN :timeStart AND :timeEnd', { timeStart, timeEnd })
        .andWhere('calendarItems.timeEnd NOT BETWEEN :timeStart AND :timeEnd', { timeStart, timeEnd })
        .orWhere('calendarItems.timeStart IS NULL AND calendarItems.timeEnd IS NULL')
        .getMany();  
      

      return rooms;
    
    } catch (error: any) {
      throw error;
    }
  }

  async create(input: CreateRoomInput) {
    try {
      const { name, status, number, schoolId } = input;

      if (!name || !status || !number) {
        throw new BadParametersError(["name", "status", "number"]);
      }

      if (!Object.values(RoomStatus).includes(status)) {
        throw new InvalidStatusError();
      }

      const roomSource = await dataSource.getRepository(Room).findOne({
        where: {
          number,
          school: { schoolId },
        },
      });

      if (roomSource) {
        throw new RoomAlreadyExistError();
      }

      const room = Object.assign(new Room(), {
        ...{ name, status, number, schoolId },
        school: { schoolId },

      } as Room);

      await dataSource.getRepository(Room).save(room);

      const newRoom = await dataSource.getRepository(Room).findOne({
        where: { roomId: room.roomId },
      });

      return newRoom;
    } catch (error: any) {
      throw error;
    }
  }
  async get(input: GetRoomInput) {
    const { id } = input;

    let room;
    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }
      const roomRepository = dataSource.getRepository(Room);

      room = await roomRepository.findOne({
        where: { roomId: id },
      });

      if (!room) {
        throw new RoomNotFoundError();
      }
    } catch (error: any) {
      throw error;
    }

    return room;
  }

  async getRooms(page: number, limit: number) {
    const roomRepository = dataSource.getRepository(Room);
    const rooms = await roomRepository.find({
      skip: (page - 1) * limit,
      take: limit,
   

    });

    return rooms;
  }
  async update(input: updateRoomInput) {
    const { id: roomId } = input;
    const { name, status, number, schoolId } = input;
    try {
      console.log(roomId);

      if (!uuidValidate(roomId)) {
        throw new InvalidUuidError();
      }

      const roomRepository = dataSource.getRepository(Room);
      let room = await roomRepository.findOne({
        where: { roomId },
      });

      if (!room) {
        throw new RoomNotFoundError();
      }

      const updateRoom = Object.assign(room, {
        ...{ name, status, number, schoolId },
      } as Room);

      await roomRepository.save(updateRoom);

      return { message: "Update successful" };
    } catch (error: any) {
      throw error;
    }
  }

  async delete(input: deleteRoomInput) {
    const { id } = input;
    try {
      const roomRepository = dataSource.getRepository(Room);
      const room = await roomRepository.findOne({
        where: { roomId: id },
      });

      if (!room) {
        throw new RoomNotFoundError();
      }

      await roomRepository.remove(room);
      return { message: "room deleted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export const roomService = new RoomService();
