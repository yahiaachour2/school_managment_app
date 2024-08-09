import { validate as uuidValidate } from 'uuid';

import { Level } from '../entities/level';
import { User } from '../entities/user';
import {
  BadParametersError,
  InvalidUuidError,
} from '../errors';
import { InvalidStatusError } from '../errors/RoomError';
import {
  UserAlreadyExistError,
  UserNotFoundError,
} from '../errors/UserError';
import {
  hashPassword,
  isEmailValid,
  isNumberValid,
} from '../helpers';
import { dataSource } from '../ormconfig';
import {
  CreateUserInput,
  deleteUserInput,
  GetUserInput,
  UpdateUserInput,
} from '../types/user';
import { UserGenders } from '../types/userGendre';
import { UserRoles } from '../types/userRoles';

export class UserService {
  async create(input: CreateUserInput) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        role,
        levelId,
        schoolId,
        scheduleId,
        parentId,
        gender,
        phone,
      } = input;

      if (!firstName || !lastName || !email || !password || !role) {
        throw new BadParametersError([
          "firstName",
          "lastName",
          "email",
          "password",
          "role",
        ]);
      }
      // Validate email
      if (!isEmailValid(email)) {
        throw new BadParametersError(["email"]);
      }

      // Validate phone
      if (!isNumberValid(phone)) {
        throw new BadParametersError(["phone"]);
      }

      const userRole: UserRoles = role as UserRoles;
      //
      if (!Object.values(UserRoles).includes(userRole)) {
        throw new InvalidStatusError();
      }

      if (
        !gender ||
        !Object.values(UserGenders).includes(gender as UserGenders)
      ) {
        throw new InvalidStatusError();
      }
      const userSource = await dataSource.getRepository(User).findOne({
        where: { email },
      });
      if (userSource) {
        throw new UserAlreadyExistError();
      }

      let parent = null;
      if (parentId) {
        parent = await dataSource.getRepository(User).findOne({
          where: { userId: parentId },
        });
        if (!parent) {
          throw new BadParametersError(["parentId"]);
        }
      }
      // Create or fetch the Level entity
      let level = await dataSource.getRepository(Level).findOne({
        where: { levelId },
      });
      if (!level) {
        level = new Level();
        
        level = await dataSource.getRepository(Level).save(level);
      }
      let children = null;
      const user = Object.assign(new User(), {
        ...input,
        school: { schoolId },
        password: hashPassword(password),
        schedule: { scheduleId },
        parent,
        children,
        level,
      });

      const newUser = await dataSource.getRepository(User).save(user);

      return newUser;
    } catch (error: any) {
      throw error;
    }
  }

  async get(input: GetUserInput) {
    const { id } = input;

    let users;
    try {
      if (!uuidValidate(id)) {
        throw new InvalidUuidError();
      }
      const sessionRepository = dataSource.getRepository(User);

      users = await sessionRepository.findOne({
        where: { userId: id },
        relations: ["parent", "level", "children"],
      });

      if (!users) {
        throw new UserNotFoundError();
      }
    } catch (error: any) {
      throw error;
    }

    return {
      users,
    };
  }

  // async getUsers(page: number, limit: number, searchRole?: string) {
  //   const userRepository = dataSource.getRepository(User);
  //   const query = userRepository
  //     .createQueryBuilder("user")
  //     .leftJoinAndSelect("user.parent", "parent")
  //     .leftJoinAndSelect("user.level", "level")
  //     .leftJoinAndSelect("user.schedule", "schedule")
  //     .leftJoinAndSelect("user.children", "children")

  //     .skip((page - 1) * limit)
  //     .take(limit);

  //   if (searchRole) {
  //     query.where("user.role = :role", { role: searchRole.trim() });
  //   }

  //   const users = await query.getMany();
  //   return users;
  // }

  async getUsers(page: number, limit: number, searchRole?: string, searchLevel?: string) {

    const userRepository = dataSource.getRepository(User);

    const query = userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.parent", "parent")
      .leftJoinAndSelect("user.level", "level")
    //  .leftJoinAndSelect("user.schedule", "schedule")
     .leftJoinAndSelect("user.children", "children")
      .skip((page - 1) * limit)
      .take(10);

      // where schoolId

    if (searchRole) {
      query.andWhere("user.role = :role", { role: searchRole.trim() });
    }
    if(searchLevel) {
      query.andWhere("level.levelId = :level" , { level : searchLevel.trim ()})
    }

    const users = await query.getMany();

    return users;
  }


  //   async  getUsers(page: number, limit: number, role?: string) {
  //     const userRepository = dataSource.getRepository(User);
  //     const query =  userRepository.createQueryBuilder('user');

  //     // if (role) {
  //     //     query.where('user.role ILIKE :role', { role: `%${role}%` });
  //     // }

  //     query.skip((page - 1) * limit)
  //         .take(limit);

  //     const users = await query.getMany();
  //     return users;
  // }

  // async getUsers(page: number, limit: number) {
  //   try {
  //     const userRepository = dataSource.getRepository(User);
  //     const users = await userRepository.find({
  //       where: {
  //         role: In(['ADMIN', 'TEACHER']) // Filter users by role
  //       },
  //       relations: [], // Include relations here if needed
  //       skip: (page - 1) * limit,
  //       take: limit,
  //     });

  //     return users;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async update(input: UpdateUserInput) {
    const { id: userId, levelId } = input;
    const {
      firstName,
      lastName,
      email,
      role,
      password,
      schoolId,
      parentId,
      gender,
      phone,
    } = input;
    let imageUrl: string | undefined;
    try {
      console.log(userId);

      if (!uuidValidate(userId)) {
        throw new InvalidUuidError();
      }

      // if (req.file) {
      //   imageUrl = req.file.filename;
      // }

      const userRepository = dataSource.getRepository(User);
      let user = await userRepository.findOne({
        where: { userId },
      });

      if (!user) {
        throw new UserNotFoundError();
      }

      // user.name = name;
      // user.email = email;
      // user.imageUrl = imageUrl || '';

      const updatedUser = Object.assign(new User(), {
        ...user,
        ...input,
      });

      console.log({
        ...user,
        ...input,
        level: { levelId },
      });

      await userRepository.save(updatedUser);

      return { message: "Update successful" };
    } catch (error: any) {
      throw error;
    }
  }

  async delete(input: deleteUserInput) {
    const { id } = input;
    try {
      const userRepository = dataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { userId: id },
      });

      if (!user) {
        throw new UserNotFoundError();
      }

      await userRepository.remove(user);
      return { message: "User deleted successfully" };
    } catch (error: any) {
      throw error;
    }
  }
}

export const userService = new UserService();
