import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { Level } from './level';
import { Room } from './room';
import { Subject } from './subject';

@Entity("schedule")
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  scheduleId!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  dayOfWeek!: string;
  
  
  @Column({ type: "varchar", length: 128, nullable: true })
  scheduleName!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  startTime!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  endTime!: string;
  
  

 

  // rooms!: Room[]



 
  @OneToMany(() => Room, room => room.schedule) 
  rooms!: Room[];
  

  
  // @OneToMany(() => Level, level => level.schedule) 
  // levels!: Level[];
  

  @OneToMany(() => Subject, subject => subject.schedule) 
  subjects!: Level[];


  // @OneToMany(() => User, user => user.schedule) 
  // users!: User[];

  // @Index()
  // @OneToOne(() => Level, { nullable: true })
  // @JoinColumn({ name: "levelId" })
  // level!: Level;


// realtion bin schedule o user
// onetomany 
}