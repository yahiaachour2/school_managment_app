import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import Calendar from './calendar';
import { CalendarItems } from './calendarItems';
import { School } from './school';
import { Subject } from './subject';
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

  @OneToOne(() => Calendar, calendar => calendar.level, { nullable: true })
  calendar!: Calendar;

  @OneToMany(() => User, user => user.level)
  users!: User[];

  @OneToMany(() => CalendarItems, calendarItems => calendarItems.level)
  calendarItems!: CalendarItems[];

  // Many-to-Many relationship with Subject using the Level_subject join table
  @ManyToMany(() => Subject, subject => subject.levelSubjects)
  subjects!: Subject[];
}
