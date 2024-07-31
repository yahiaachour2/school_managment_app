import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { CalendarItems } from './calendarItems';
import { Level } from './level';
import { User } from './user';

@Entity("calendar")
export default class Calendar extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  calendarId!: string;
  @Index()
  @Column({ type: "varchar", length: 128, nullable: true })
  calendarName!: string;


  @Index()
  @Column({ type: "varchar", length: 128, nullable: true })
  byDay!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  byMonth!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  byMonthDay!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  byMonthWeek!: string;



  // @OneToOne(() => School, school => school.calendar)
  // @JoinColumn({ name: "schoolId" })
  // school!: School;

  @OneToOne(() => Level, level => level.calendar, { nullable: true })
  @JoinColumn({ name: "levelId" })
  level!: Level;

  // @OneToMany(() => Session, session => session.calendar)
  

  // sessions!: Session[];
  // @ManyToOne(() => CalendarItems, calendarItems => calendarItems.calendar, { nullable: true })
  // @JoinColumn({ name: "calendaritemId" })
  // calendarItems!: CalendarItems;

  @OneToMany(() => CalendarItems, calendarItems => calendarItems.calendar)
  calendarItems!: CalendarItems[];

  
  // @OneToMany(() => User, user => user.calendar) 
  // users!: User[];
  @OneToOne(() => User, user => user.calendar, { nullable: true })
  @JoinColumn({ name: "userId" })
  teacher!: User;
}
