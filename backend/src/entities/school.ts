import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from './baseEntity';
import { Level } from './level';
import { Room } from './room';
import { Session } from './session';
import { User } from './user';

@Entity("school")
export class School extends BaseEntity {
  
    @PrimaryGeneratedColumn("uuid")
    schoolId! :string;
    @Index ()

    @Column   ({ type: "varchar", length: 128, nullable: true })  
    name! :string;
    
    @Column   ({ type: "varchar", length: 128, nullable: true })  
    address! :string;


    @Column   ({ type: "varchar", length: 128, nullable: true })  
    canonicalName! :string;

    @OneToMany(() => Room, room => room.school)
    rooms!: Room[];
    @OneToMany(() => Level, level => level.school)
    levels!: Level[];


    @OneToMany(() => Session, session => session.school)
    sessions!: Session[];

    @OneToMany(() => User, user => user.school)
    users!: User[];
    // @OneToOne(() => Calendar, calendar => calendar.school)
    // calendar!: Calendar;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
  
    @DeleteDateColumn()
    deletedAt!: Date;
}
