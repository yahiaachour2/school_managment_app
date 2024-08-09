import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EventType } from '../types/eventType';
import { CalendarType } from '../types/itemType';
import { BaseEntity } from './baseEntity';
import Calendar from './calendar';
import { Level } from './level';
import { Room } from './room';
import { Subject } from './subject';
import { User } from './user';

@Entity("calendarItems")
export class CalendarItems extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  calendarItemId!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  itemName!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  timeStart!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  timeEnd!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  description!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  eventType!: EventType;

  @Column({ type: "varchar", length: 128, nullable: true })
  type!: CalendarType;


  // @OneToMany(() => Calendar, calendar => calendar.CalendarItems)
  // calendar!: Calendar[];
  @ManyToOne(() => Calendar, { nullable: true })
  @JoinColumn({ name: "calendarId" })
  calendar!: Calendar;

  @ManyToOne(() => Level, { nullable: true })
  @JoinColumn({ name: "levelId" })
  level!: Level;
   
  @ManyToOne(() => Room, { nullable: true })
  @JoinColumn({ name: "roomId" })
  room!: Room;
    
  @ManyToOne(() => Subject, { nullable: true })
  @JoinColumn({ name: "subjectId" })
  subject!: Subject;


  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  teacher!: User;
  // @OneToMany(() => Level, level => level.calendarItems)
  // levels!: Level[];
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  student!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
