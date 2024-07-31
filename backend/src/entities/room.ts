import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { RoomStatus } from '../types/room';
import { BaseEntity } from './baseEntity';
import { CalendarItems } from './calendarItems';
import { Schedule } from './schedule';
import { School } from './school';

@Entity("room")
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  roomId!: string;

  @Index()
  @ManyToOne(() => School, { nullable: false })
  @JoinColumn({ name: "schoolId" })
  school!: School;

  @RelationId((room: Room) => room.school)
  schoolId!: string;
  @Column({ type: "varchar", length: 128, nullable: true })
  name!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  status!: RoomStatus;
  
  @Column({ type: "varchar", length: 128, nullable: true })
  number!: string;

 @Index()
  @ManyToOne(() => Schedule, { nullable: true })
  @JoinColumn({ name: "scheduleId" })
  schedule!: Schedule;

  @RelationId((room: Room) => room.schedule)
  scheduleId!: string;
  
  @OneToMany(() => CalendarItems, calendarItems => calendarItems.room)
  calendarItems!: CalendarItems[];
  
}
