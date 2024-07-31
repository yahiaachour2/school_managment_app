import { Schedule } from '../entities/schedule';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import {
  ScheduleAlreadyExistError,
  ScheduleNotFoundError,
} from '../errors/scheduleError';
import { uuidValidate } from '../helpers/uuid';
import { dataSource } from '../ormconfig';
import {
  CreateScheduleInput,
  deleteScheduleInput,
  GetScheduleInput,
  updateScheduleInput,
} from '../types/schedule';

export class ScheduleService {
  async create(input: CreateScheduleInput) {
    try {
      const { dayOfWeek, startTime, endTime ,levelId } = input;

      if (!dayOfWeek || !startTime || !endTime) {
        throw new BadParametersError(["dayOfWeek", "startTime", "endTime"]);
      }

      const scheduleSource = await dataSource.getRepository(Schedule).findOne({
        where: {
          dayOfWeek,
          startTime,
          endTime,
        },
      });

      if (scheduleSource) {
        throw new ScheduleAlreadyExistError();
      }

      const schedule = Object.assign(new Schedule(), {
        ...input,
        level : {levelId}
      });

      await dataSource.getRepository(Schedule).save(schedule);

      const newSchedule = await dataSource.getRepository(Schedule).findOne({
        where: { scheduleId: schedule.scheduleId },
      });

      return schedule;
    } catch (error: any) {
      throw error;
    }
  }
  async get(input: GetScheduleInput) {
    const { id } = input;

    let schedule;
    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }
      const scheduleRepository = dataSource.getRepository(Schedule);

      schedule = await scheduleRepository.findOne({
        where: { scheduleId: id },
      });

      if (!schedule) {
        throw new ScheduleNotFoundError();
      }
    } catch (error: any) {
      throw error;
    }

    return schedule;
  }

  async getSchedules(page: number, limit: number) {
    const scheduleRepository = dataSource.getRepository(Schedule);
    const schedules = await scheduleRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return schedules;
  }
  async update(input: updateScheduleInput) {
    const { id: scheduleId } = input;
    const { dayOfWeek, startTime, endTime } = input;
    try {
      console.log(scheduleId);

      if (!uuidValidate(scheduleId)) {
        throw new InvalidUuidError();
      }

      const scheduleRepository = dataSource.getRepository(Schedule);
      let schedule = await scheduleRepository.findOne({
        where: { scheduleId },
      });

      if (!schedule) {
        throw new ScheduleNotFoundError();
      }

      const updateSchedule = Object.assign(schedule, {
        ...{ dayOfWeek, startTime, endTime },
      });

      await scheduleRepository.save(updateSchedule);

      return { message: "Update successful" };
    } catch (error: any) {
      throw error;
    }
  }

  async delete(input: deleteScheduleInput) {
    const { id } = input;
    try {
      const scheduleRepository = dataSource.getRepository(Schedule);
      const schedule = await scheduleRepository.findOne({
        where: { scheduleId: id },
      });

      if (!schedule) {
        throw new ScheduleNotFoundError();
      }

      await scheduleRepository.remove(schedule);
      return { message: "schedule deleted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();
