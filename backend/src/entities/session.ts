import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import Calendar from './calendar';
import { School } from './school';

@Entity("Session")
  export class Session extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    SessionId!: string;
    @Index()
    @Column({nullable: true })
    StartDate!: Date;
  
    @Column({  nullable: true })
    FinDate!: Date;
  
 
  
    @Index()
    @ManyToOne(() => School, { nullable: false })
    @JoinColumn({ name: 'schoolId' })
    school!: School
  
    @RelationId((session: Session) => session.school)
    schoolId!: string;

    @ManyToOne(() => Calendar, {nullable:true})
    @JoinColumn({ name: "calendarId" })

  calendar!: Calendar;
    
    
    
   
    
  
  
  }
  