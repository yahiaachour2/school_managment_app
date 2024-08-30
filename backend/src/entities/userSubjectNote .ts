import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { Subject } from './subject';
import { User } from './user';

@Entity("user_subject_note")
  export class UserSubjectNote extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column({ type: "decimal", precision: 5, scale: 2 })
    note!: number;
  
    @ManyToOne(() => User, user => user.userSubjectNotes)
    @JoinColumn({ name: "userId" })
    user!: User;
  
    @ManyToOne(() => Subject, subject => subject.userSubjectNotes)
    @JoinColumn({ name: "subjectId" })
    subject!: Subject;
  }
  