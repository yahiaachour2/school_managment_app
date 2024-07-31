// import {
//   Request,
//   Response,
// } from 'express';
// import * as cache from 'memory-cache';

// import { Absence } from '../entity/absence';
// import { Level } from '../entity/level';
// import { dataSource } from '../ormconfig';

// //where organizarionId => orgId
//   export class absenceService {
//     static async createAbsencet(req: Request, res: Response) {
//       const { studentId,absenceDate,recordingTeacherId } = req.body;
//       const absence = new Absence();
//       absence.studentId = studentId;
//       absence.absenceDate = absenceDate;
//       absence.recordingTeacherId = recordingTeacherId;
  
//       const absenceRepository = dataSource.getRepository(Level);
//       await absenceRepository.save(absence);
//       return res
//         .status(200)
//         .json({ message: "Room created successfully", absence });
//     }
    
    
//     static async getAbsencet(req: Request, res: Response) {
//       const { absenceId } = req.params;
//       const absenceRepository = dataSource.getRepository(Absence);
//       const absence = await absenceRepository.findOne({
//         where: { absenceId },
//       });
  
//       if (!absence) {
//         return res.status(404).json({ message: "absence not found" });
//       }
//       return res.status(200).json({
//         data: absence,
//       });
//     }
    
    
//     static async getAbsencets(req: Request, res: Response) {
//       const data = cache.get("data");
//       if (data) {
//         console.log("serving from cache");
//         return res.status(200).json({
//           data,
//         });
//       } else {
//         console.log("serving from db");
//         const absencesRepository = dataSource.getRepository(Absence);
//         const absences = await absencesRepository.find();
  
//         cache.put("data", absences, 6000);
//         return res.status(200).json({
//           data: absences,
//         });
//       }
//     }
//     //   level Level
  
//     static async updateAbsencet(req: Request, res: Response) {
//       const { absenceId } = req.params;
//       const { studentId,absenceDate,recordingTeacherId  } = req.body;
  
//       const absenceRepository = dataSource.getRepository(Absence);
//       const absence = await absenceRepository.findOne({
//         where: { absenceId },
//       });
//       if (!absence) {
//         return res.status(404).json({ message: "Level not found" });
//       }
//       absence.studentId = studentId;
//       absence.absenceDate = absenceDate;
//       absence.recordingTeacherId = recordingTeacherId;
  
//       await absenceRepository.save(absence);
//       res.status(200).json({ message: "Update successful", absence });
//     }
  
//       static async deletedAbsencet(req: Request, res: Response) {
//         const { absenceId } = req.params;
//         const absenceRepository = dataSource.getRepository(Absence);
//         const absence = await absenceRepository.findOne({
//           where: { absenceId },
//         });
  
//         if (!absence) {
//           return res.status(404).json({ message: "absence not found" });
//         }
  
//         await absenceRepository.remove(absence);
//         return res.status(200).json({ message: "absence deleted successfully" });
//       }
//   }
  