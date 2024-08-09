import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';

import { uuidv4 } from '../helpers/uuid';
import { UserGenders } from '../types/userGendre';
import { UserRoles } from '../types/userRoles';
import { BaseEntity } from './baseEntity';
import Calendar from './calendar';
import { CalendarItems } from './calendarItems';
import { Level } from './level';
import { School } from './school';

// import { Student } from './student';

@Entity("user")
@Index('email_school_unique', ['email', 'school'], {
  unique: true,
  where: '"deletedAt" is null'
})
export class User extends BaseEntity {
  @Index()
  @PrimaryColumn("uuid")
  userId!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  firstName!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  lastName!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  email!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  password!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  phone!: string;
  @Column({ type: "varchar", length: 128, nullable: true })
  gender!: UserGenders;

  @Column({ type: "varchar", length: 128, nullable: true })
  role!: UserRoles;


  
  



  // @Column({ type: "varchar", length: 128, nullable: true })
  // genre!: string;
  
  // @Column({ type: "varchar", length: 128, nullable: true })
  // password!: string;

  @Column({ nullable: true })
  imageUrl!: string;

  @Column({ nullable: true }) // Token field
  token!: string;

  @Column({ nullable: true }) // Refresh token field
  refreshToken!: string;

  @Index()
  @ManyToOne(() => School, { nullable: true })
  @JoinColumn({ name: "schoolId" })
  school!: School;

  @RelationId((user: User) => user.school)
  schoolId!: string;
  
  @ManyToOne(() => User, user => user.children, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent!: User;

  @OneToMany(() => User, user => user.parent)
  children!: User[];

  // @OneToMany(() => Student, student => student.parent) 
  // students!: Student[];

  
@OneToMany(() => CalendarItems, calendarItems => calendarItems.teacher)
calendarItems!: CalendarItems[];
  
@OneToMany(() => CalendarItems, calendarItems => calendarItems.student)
calendarItem!: CalendarItems[];

  // @Index()
  // @ManyToOne(() => Calendar, { nullable: true })
  // @JoinColumn({ name: "calendarId" })
  // calendar!: Calendar;
  @OneToOne(() => Calendar, calendar => calendar.teacher, { nullable: true })
  calendar!: Calendar;

  @Index()
  @ManyToOne(() => Level, { nullable: true })
  @JoinColumn({ name: "levelId" })
  level!: Level;
 
  @RelationId((user: User) => user.level)
  levelId!: string;

  @BeforeInsert()
  setId () {
      if (!this.userId) {       
          this.userId = uuidv4()
      }
  }  
}
