import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { Level } from './level';  // Importez l'entité Level
import { Subject } from './subject';
import { User } from './user';

@Entity("user_subject_note")
export class UserSubjectNote extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  noteId!: string;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  note!: number;

  @ManyToOne(() => User, user => user.userSubjectNotes)
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Subject, subject => subject.userSubjectNotes)
  @JoinColumn({ name: "subjectId" })
  subject!: Subject;

  @ManyToOne(() => Level, level => level.userSubjectNotes)  // Ajoutez cette relation
  @JoinColumn({ name: "levelId" })  // Spécifiez la colonne pour la clé étrangère
  level!: Level;  // Déclarez la propriété level
}
