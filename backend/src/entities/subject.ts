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

import { BaseEntity } from './baseEntity';
import { CalendarItems } from './calendarItems';
import { Schedule } from './schedule';

@Entity("subject")
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  subjectId!: string;
  @Index()
  @Column({ type: "varchar", length: 128, nullable: true })
  name!: string;

  // @Index()
  // @ManyToOne(() => Schedule, { nullable: false })
  // @JoinColumn({ name: "scheduleId" })
  // schedule!: Schedule;
  // @RelationId((subject: Subject) => subject.schedule)
  // scheduleId!: string
  // @Column({ nullable: true })
  // scheduleId!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  coefficient!: string;

  
@Index()
@ManyToOne(() => Schedule, { nullable: true })
@JoinColumn({ name: "scheduleId" })
schedule!: Schedule;

@RelationId((subject: Subject) => subject.schedule)
scheduleId!: string;

@OneToMany(() => CalendarItems, calendarItems => calendarItems.subject)
calendarItems!: CalendarItems[];
  
}
