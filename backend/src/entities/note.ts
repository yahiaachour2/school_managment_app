import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';

@Entity("note")
    export class Note extends BaseEntity {
      @PrimaryGeneratedColumn("uuid")
      noteId!: string;
      @Index ()
    
      @Column({ type: "varchar", length: 128, nullable: true })
      number !: number;
      @Column({ type: "varchar", length: 128, nullable: true })
      studentId!: string; 
      
      @Column({ type: "varchar", length: 128, nullable: true })
      studentName!: number; 
      
      @Column({ type: "varchar", length: 128, nullable: true })
      teacherId!: number;
  
  
    }