import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { Level } from './level';
import { Subject } from './subject';

@Entity("level_subject")
  export class Level_subject extends BaseEntity {
  
    @PrimaryColumn()
    levelId!: string;
  
    @PrimaryColumn()
    subjectId!: string;
  
    @ManyToOne(() => Level, level => level.subjects, { nullable: false })
    @JoinColumn({ name: "levelId" })
    level!: Level;
  
    @ManyToOne(() => Subject, subject => subject.levelSubjects, { nullable: false })
    @JoinColumn({ name: "subjectId" })
    subject!: Subject;
  
  
  }
  