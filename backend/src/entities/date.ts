import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';

@Entity("date")
export class DateEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    dateId!: string;
    @Index ()
    
    @Column({ type: "date" })
    date!:Date;
   

}