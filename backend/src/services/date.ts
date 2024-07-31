// import {
//   Request,
//   Response,
// } from 'express';

// import { DateEntity } from '../entity/date';
// import { dataSource } from '../ormconfig';

// export class DateService {
//         static async createDate(req: Request, res: Response) {
//                 const { date: requestedDate, scheduleId } = req.body; // Use 'requestedDate' instead of 'date' to avoid redeclaration
//                 const newDate = new DateEntity(); // Use 'newDate' instead of 'date' to avoid redeclaration
//                 newDate.date = requestedDate;
//                 newDate.scheduleId = scheduleId;
                
//                 const dateRepository = dataSource.getRepository(DateEntity);
//                 await dateRepository.save(newDate);
                
//                 return res
//                     .status(200)
//                     .json({ message: "Date created successfully", room: newDate }); // Correct the response object to use 'newDate' instead of 'room'
//             }


//         //   static async getRoom(req: Request, res: Response) {
//         //     const { roomId } = req.params;
//         //     const dateRepository = dataSource.getRepository(Room);
//         //     const room = await dateRepository.findOne({
//         //       where: { roomId },
//         //     });
        
//         //     if (!room) {
//         //       return res.status(404).json({ message: "Room not found" });
//         //     }
//         //     return res.status(200).json({
//         //       data: room,
//         //     });
//         //   }
//         //   static async getRooms(req: Request, res: Response) {
//         //     const data = cache.get("data");
//         //     if (data) {
//         //       console.log("serving from cache");
//         //       return res.status(200).json({
//         //         data,
//         //       });
//         //     } else {
//         //       console.log("serving from db");
//         //       const roomsRepository = dataSource.getRepository(Room);
//         //       const Rooms = await roomsRepository.find();
        
//         //       cache.put("data", Rooms, 6000);
//         //       return res.status(200).json({
//         //         data: Rooms,
//         //       });
//         //     }
//         //   }
        
//         //   static async updateRoom(req: Request, res: Response) {
//         //     const { roomId } = req.params;
//         //     const { availabilityStatus } = req.body;
            
      
//         //     const dateRepository = dataSource.getRepository(Room);
//         //     const room = await dateRepository.findOne({
//         //       where: { roomId },
//         //     });
//         //     if (!room) {
//         //       return res.status(404).json({ message: "User not found" });
//         //     }
//         //     room!.availabilityStatus = availabilityStatus;
      
//         //     await dateRepository.save(room!);
//         //     res.status(200).json({ message: "Update successful", room });
//         //   }
        
//         //   static async deletedRoom(req: Request, res: Response) {
//         //     const { roomId } = req.params;
//         //     const dateRepository = dataSource.getRepository(Room);
//         //     const room = await dateRepository.findOne({
//         //       where: { roomId },
//         //     });
        
//         //     if (!room) {
//         //       return res.status(404).json({ message: "school not found" });
//         //     }
        
//         //     await dateRepository.remove(room);
//         //     return res.status(200).json({ message: "school deleted successfully" });
//           }
       
        