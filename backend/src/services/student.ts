// import { Student } from '../entities/student';
// import { User } from '../entities/user';
// import {
//   BadParametersError,
//   InvalidUuidError,
// } from '../errors';
// import {
//   StudentAlreadyExistError,
//   StudentNotFoundError,
// } from '../errors/StudentError';
// import { uuidValidate } from '../helpers/uuid';
// import { dataSource } from '../ormconfig';
// import {
//   CreateStudentInput,
//   deleteStudentInput,
//   GetStudentInput,
//   UpdateStudentInput,
// } from '../types/student';
// import { userService } from './user';

// export class StudentService {
//   async create(input: CreateStudentInput) {
//     try {
//       const {
//         lastName,
//         firstName,
//         levelId,
//         email,
//         parentId,
//         role,
//         password,
//         schoolId,
//       } = input;
//       if (!lastName || !firstName) {
//         throw new BadParametersError(["lastName", "firstName"]);
//       }

//       const userStudentData = await userService.create({
//         ...input,
        
//       });

//       const newUserStudent = await dataSource
//         .getRepository(User)
//         .save(userStudentData);

//       if (!newUserStudent) {
//         throw new StudentAlreadyExistError();
//       }

//       const student = dataSource.getRepository(Student).create({
//         ...input,
//         user: { userId: newUserStudent.userId },
//         level: { levelId },
//         parent: { userId: parentId },
        
        
//       });
    
//        await dataSource.getRepository(Student).save(student);
//       const newStudent = await dataSource.getRepository(Student).findOne({
//         where: { studentId: student.studentId },
//       });

//       return newStudent;
//     } catch (error) {
//       console.log(error);
      
//       throw error;
//     }
//   }

//   async get(input: GetStudentInput) {
//     const { id: studentId, relations } = input;

//     try {
//       if (!uuidValidate(studentId)) {
//         throw new InvalidUuidError();
//       }
//       const student = await dataSource.getRepository(Student).findOne({
//         where: { studentId },
//         relations: ["user", 'parent','level' ,'level.schedule'],
//         // relations: ["user", 'parent' ,'level.schedule'],

//       });

//       if (!student) {
//         throw new StudentNotFoundError();
//       }

//       return student;
//     } catch (error) {
//       throw error;
//     }
//   }
  

//   async getStudents(page: number, limit: number) {
//     try {      
//       const students = await dataSource.getRepository(Student).find({
//         relations: ["user","parent","level"],

//         skip: (page - 1) * limit,
//         take: limit,
//       });

//       return students;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async update(input: UpdateStudentInput) {
//     const { id: studentId, lastName, firstName } = input;

//     try {
//       if (!uuidValidate(studentId)) {
//         throw new InvalidUuidError();
//       }

//       const studentRepository = dataSource.getRepository(Student);
//       const student = await studentRepository.findOne({
//         where: { studentId },
//       });

//       if (!student) {
//         throw new StudentNotFoundError();
//       }

//       await studentRepository.update(studentId, { lastName, firstName });

//       return { message: "Update successful" };
//     } catch (error) {
//       throw error;d
//     }
//   }

//   async delete(input: deleteStudentInput) {
//     const { id } = input;

//     try {
//       const studentRepository = dataSource.getRepository(Student);
//       const student = await studentRepository.findOne({
//         where: { studentId: id },
//       });c

//       if (!student) {
//         throw new StudentNotFoundError();
//       }

//       await studentRepository.remove(student);

//       return { message: "Student deleted successfully" };
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// export const studentService = new StudentService();
