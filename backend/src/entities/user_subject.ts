import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { Subject } from './subject';
import { User } from './user';

@Entity("user_subject")
  export class User_subject extends BaseEntity {
  
    @PrimaryColumn()
    userId!: string;
  
    @PrimaryColumn()
    subjectId!: string;
  
    @ManyToOne(() => User, user => user.userSubjects, { nullable: false })
   @JoinColumn({ name: "userId" })
    user!: User;
  
    @ManyToOne(() => Subject, subject => subject.userSubjects, { nullable: false })
    @JoinColumn({ name: "subjectId" })
    subject!: Subject;
    
  
  
  }
  