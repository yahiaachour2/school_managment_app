import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';

@Entity("notificationEntity")
export class NotificationEntity extends BaseEntity {
  
  @PrimaryGeneratedColumn("uuid")
  notificationId!: string;
  @Column()
  title!: string;
 
 
}
