import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { CalendarItems } from './calendarItems';
import { Level } from './level';
import { User_subject } from './user_subject';
import { UserSubjectNote } from './userSubjectNote ';

@Entity("subject")
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  subjectId!: string;

  @Index()
  @Column({ type: "varchar", length: 128, nullable: true })
  name!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  coefficient!: string;

  @OneToMany(() => CalendarItems, calendarItems => calendarItems.subject)
  calendarItems!: CalendarItems[];

  @OneToMany(() => User_subject, userSubject => userSubject.subject)
  userSubjects!: User_subject[];

  // Many-to-Many relationship with Level using the Level_subject join table
  @ManyToMany(() => Level, level => level.subjects)
  levelSubjects!: Level[];

  @OneToMany(() => UserSubjectNote, userSubjectNote => userSubjectNote.subject)
  userSubjectNotes!: UserSubjectNote[];
}
