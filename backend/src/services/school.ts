import { School } from '../entities/school';
// import { Student } from '../entities/student';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import {
  SchoolAlreadyExistError,
  SchoolNotFoundError,
} from '../errors/SchoolError';
import { slugify } from '../helpers/canonicalName';
import { uuidValidate } from '../helpers/uuid';
import { dataSource } from '../ormconfig';
import {
  CreateSchoolInput,
  deleteSchoolInput,
  getSchoolInput,
  updateSchoolInput,
} from '../types/school';

export class SchoolService {
  async create(input: CreateSchoolInput) {
    try {
      const { name, address } = input;

      if (!name || !address) {
        throw new BadParametersError(["name", "address"]);
      }
      const canonicalName = slugify(name);

      const schoolSource = await dataSource.getRepository(School).findOne({
        where: { canonicalName }, // slugify
      });
      if (schoolSource) {
        throw new SchoolAlreadyExistError();
      }

      const school = Object.assign(new School(), {
        name,
        address,
        canonicalName,
      });

      const newSchool = await dataSource.getRepository(School).save(school);

      return newSchool;
    } catch (error: any) {
      throw error;
    }
  }
  async get(input: getSchoolInput) {
    const { id } = input;

    try {
      const schoolRepository = dataSource.getRepository(School);

      const school = await schoolRepository.findOne({
        where: { schoolId: id },

        relations: ['rooms', 'sessions', 'users'] // Include relations as needed

      });

      if (!school) {
         throw new SchoolNotFoundError;
      }

      return school;
    } catch (error) {
      throw error;
    }
  }
  // async get(input: getSchoolInput) {
  //   const { id } = input;

  //   try {
  //     const school = await dataSource
  //       .getRepository(School)
  //       .createQueryBuilder("school")
  //       .leftJoinAndSelect("school.rooms", "room")
  //       .leftJoinAndSelect("school.sessions", "session")
  //       .leftJoinAndSelect("school.users", "user", "user.role = :role", {
  //         role: UserRoles.PARENT,
  //       })
  //       .leftJoinAndMapMany(
  //         "user.students",
  //         // Student,
  //         "student",
  //         "student.parentId = user.userId"
  //       )
  //       .where("school.schoolId = :schoolId", { schoolId: id })
  //       .getOne();

  //     if (!school) {
  //       throw new SchoolNotFoundError();
  //     }

  //     return school;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async getSchools(page: number, limit: number) {
    try {
      const schoolRepository = await dataSource.getRepository(School);

      const schools = await schoolRepository.find({
        skip: (page - 1) * limit,
        take: limit,
      });

      return schools;
    } catch (error) {
      throw error;
    }
  }
  // async getSchools(page: number, limit: number) {
  //   try {
  //     const schools = await dataSource.getRepository(School)
  //       .createQueryBuilder('school')
  //       .leftJoinAndSelect('school.rooms', 'room')
  //       .leftJoinAndSelect('school.sessions', 'session')
  //       .leftJoinAndSelect('school.users', 'user', 'user.role = :role', { role: UserRoles.PARENT })
  //       .leftJoinAndMapMany('user.students', Student, 'student', 'student.parentId = user.userId')
  //       .skip((page - 1) * limit)
  //       .take(limit)
  //       .getMany();
  //       console.log(schools);

  //     return schools;
  //     console.log(schools);

  //   } catch (error) {
  //     console.log(error);

  //     throw error;
  //   }
  // }

  async update(input: updateSchoolInput) {
    const { name, address } = input;
    const { id: schoolId } = input;
    try {
      if (!uuidValidate(schoolId)) {
        throw new InvalidUuidError();
      }

      const schoolRepository = dataSource.getRepository(School);
      let school = await schoolRepository.findOne({
        where: { schoolId },
      });

      if (!school) {
        throw new SchoolNotFoundError();
      }

      const updatedSchool = Object.assign(school, {
        ...{ name, address },
      } as School);

      await schoolRepository.save(updatedSchool);

      return { message: "Update successful" };
    } catch (error: any) {
      throw error;
    }
  }

  async delete(input: deleteSchoolInput) {
    const { id } = input;
    try {
      const schoolRepository = dataSource.getRepository(School);
      const school = await schoolRepository.findOne({
        where: { schoolId: id },
      });

      if (!school) {
        throw new SchoolNotFoundError();
      }

      await schoolRepository.remove(school);
      return { message: "school deleted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export const schoolService = new SchoolService();
