import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import Calendar from './calendar';
import { CalendarItems } from './calendarItems';
import { School } from './school';
// import { Student } from './student';
import { User } from './user';

@Entity("level")
export class Level extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  levelId!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  name!: string;
  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: "schoolId" })
  school!: School;
  

  // @Index()
  // @OneToOne(() => Schedule, { nullable: true })
  // @JoinColumn({ name: "scheduleId" })
  // schedule!: Schedule;
 
  // @RelationId((level: Level) => level.schedule)
  // scheduleId!: string;

  @OneToOne(() => Calendar, calendar => calendar.level, { nullable: true })
  calendar!: Calendar;
  
  @OneToMany(() => User, user => user.level)
  users!: User[];

  
  @OneToMany(() => CalendarItems, calendarItems => calendarItems.level)
  calendarItems!: CalendarItems[];

  // @OneToMany(() => Student, students => students.level)
  // students!: User[];

  


  


}
