// import {
//   Request,
//   Response,
// } from 'express';

// import { studentService } from '../services/student';

// export class StudentController {
//   async create(req: Request, res: Response) {
//     try {
//       const newStudent = await studentService.create(req.body);
// // student
//       // const newStudent = await studentService.get({
//       //   id: student.studentId,
//       //   relations: ["user", 'parent'],
//       // });
// // student
//       return res.status(201).json(newStudent);
//     } catch (error: any) {
//       console.error(error);
//       return res.status(error?.httpStatusCode || 500).send(error);
//     }
//   }

//   async get(req: Request, res: Response) {
//     const { id } = req.params;

//     try {
//       const student = await studentService.get({id});

//       return res.status(201).json(student);
//     } catch (error: any) {
//       return res.status(error?.httpStatusCode || 500).send(error);
//     }
//   }

//   async getStudents(req: Request, res: Response) {
//     try {
//       let {page=1,limit=10} =req.query
//       page = parseInt(page as string)
//       limit =parseInt(limit as string)

//       const students = await studentService.getStudents(page, limit);

//       return res.status(200).json(students);
//     } catch (error: any) {
//       return res.status(error?.httpStatusCode || 500).send(error);
//     }
//   }
//   async update(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const { lastName, firstName } = req.body;

//       await studentService.update({ id, lastName, firstName });
//       return res.status(200).json({ message: "Update successful" });
//     } catch (error: any) {
//       return res.status(error?.httpStatusCode || 500).send(error);
//     }
//   }

//   async delete(req: Request, res: Response) {
//     try {
//       const { id } = req.params;

//       const result=await studentService.delete({ id });
//       return res.status(200).json(result);
//     } catch (error: any) {
//       console.log(error);
//       return res.status(error?.httpStatusCode || 500).send(error);
//     }
//   }
// }
// export const studentController = new StudentController();
