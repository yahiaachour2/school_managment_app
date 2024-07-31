// import {
//   Request,
//   Response,
// } from 'express';
// import * as cache from 'memory-cache';

// import { NotificationEntity } from '../entity/notification';
// import { dataSource } from '../ormconfig';

// export class NotificationService {
//   static async createNotification(req: Request, res: Response) {
//     const { title} =
//       req.body;
    
//     const notification = new NotificationEntity();
//     notification.title = title;
  
//     const notificationRepository = dataSource.getRepository(NotificationEntity);
//     await notificationRepository.save(notification);
//     return res
//       .status(200)
//       .json({ message: "School created successfully", notification });
//   }



//   static async getNotification(req: Request, res: Response) {
//     const { notificationId } = req.params;
//     const notificationRepository = dataSource.getRepository(NotificationEntity);
//     const notification = await notificationRepository.findOne({
//       where: { notificationId: notificationId }, // Specify column name
//     });

//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }

//     return res.status(200).json({ data: notification });
//   }
//     static async getNotifications(req: Request, res: Response) {
//       const data = cache.get("data");
//       if (data) {
//         console.log("serving from cache");
//         return res.status(200).json({
//           data,
//         });
//       } else {
//         console.log("serving from db");
//         const notificationsRepository = dataSource.getRepository(NotificationEntity );
//         const Notifications = await notificationsRepository.find();

//         cache.put("data", Notifications, 6000);
//         return res.status(200).json({
//           data: Notifications,
//         });
//       }
//     }

//     static async updateNotification(req: Request, res: Response) {
//       const { notificationId } = req.params;
//       const { title } = req.body;
      

//       const notificationRepository = dataSource.getRepository(NotificationEntity);
//       const notification = await notificationRepository.findOne({
//         where: { notificationId: notificationId },
//       });
//       if (!notification) {
//         return res.status(404).json({ message: "notification not found" });
//       }
//       notification!.title = title;

//       await notificationRepository.save(notification!);
//       res.status(200).json({ message: "Update successful", notification });
//     }
    

//     static async deletedNotification(req: Request, res: Response) {
//       const { notificationId } = req.params;
//       const notificationRepository = dataSource.getRepository(NotificationEntity);
//       const notification = await notificationRepository.findOne({
//         where: { notificationId }, // Assuming notificationId is numeric
//       });
  
//       if (!notification) {
//         return res.status(404).json({ message: "Notification not found" });
//       }
  
//       try {
//         await notificationRepository.remove(notification);
//         return res.status(200).json({ message: "Notification deleted successfully" });
//       } catch (error) {
//         return res.status(500).json({ message: "Failed to delete notification" });
//       }
//     }
// }
