// import {
//   Request,
//   Response,
// } from 'express';
// import * as cache from 'memory-cache';

// import { Note } from '../entity/note';
// import { dataSource } from '../ormconfig';

// //where organizarionId => orgId
//     export class noteService {
//       static async createNote(req: Request, res: Response) {
//         const { number  , studentId, studentName ,teacherId } = req.body;
//         const note = new Note();
//         note.number  = number ;
//         note.studentId  = studentId ;
//         note.studentName  = studentName ;

//         note.teacherId  = teacherId ;

    
//         const noteRepository = dataSource.getRepository(Note);
//         await noteRepository.save(note);
//         return res
//           .status(200)
//           .json({ message: "Room created successfully", note });
//       }
      
      
//       static async getNote(req: Request, res: Response) {
//         const { noteId } = req.params;
//         const noteRepository = dataSource.getRepository(Note);
//         const note = await noteRepository.findOne({
//           where: { noteId },
//         });
       
    
//         if (!note) {
//           return res.status(404).json({ message: "note not found" });
//         }
//         return res.status(200).json({
//           data: note,
//         });
//       }
//       static async getNotes(req: Request, res: Response) {
//         const data = cache.get("data");
//         if (data) {
//           console.log("serving from cache");
//           return res.status(200).json({
//             data,
//           });
//         } else {
//           console.log("serving from db");
//           const subjectsRepository = dataSource.getRepository(Note);
//           const Notes = await subjectsRepository.find();
    
//           cache.put("data", Notes, 6000);
//           return res.status(200).json({
//             data: Notes,
//           });
//         }
//       }
  
//       static async updateNote(req: Request, res: Response) {
//         const { noteId } = req.params;
//         const { number  , studentId, studentName ,teacherId  } = req.body;
    
//         const noteRepository = dataSource.getRepository(Note);
//         const note = await noteRepository.findOne({
//           where: { noteId },
//         });
//         if (!note) {
//           return res.status(404).json({ message: "note not found" });
//         }
//         note.number!  = number ;
//         note.studentId!  = studentId ;
//         note.studentName ! = studentName ;

//         note.teacherId  = teacherId ;
//         await noteRepository.save(note!);
//         res.status(200).json({ message: "Update successful", note });
//       }
//       //   note Note
  
//         static async deletedNote(req: Request, res: Response) {
//           const { noteId } = req.params;
//           const noteRepository = dataSource.getRepository(Note);
//           const note = await noteRepository.findOne({
//             where: { noteId },
//           });
    
//           if (!note) {
//             return res.status(404).json({ message: "note not found" });
//           }
    
//           await noteRepository.remove(note);
//           return res.status(200).json({ message: "note deleted successfully" });
//         }
//     }
    