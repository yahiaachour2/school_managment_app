import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';

@Entity("absence")
export class Absence extends BaseEntity{
  @PrimaryColumn("uuid")
  absenceId!: string;
  
  @Index ()
  @Column({ type: "varchar",  nullable: true })
  studentId!:string;
 
  @Column({ type: "varchar", length: 128, nullable: true })
  absenceDate!:number;
  
  @Column({ type: "varchar", length: 128, nullable: true })
  recordingTeacherId!:number;
  date: any;
  

}
