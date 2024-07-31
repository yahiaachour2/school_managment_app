// import {
//   Column,
//   Entity,
//   Index,
//   JoinColumn,
//   ManyToOne,
//   OneToOne,
//   PrimaryGeneratedColumn,
//   RelationId,
// } from 'typeorm';

// import { BaseEntity } from './baseEntity';
// import { Level } from './level';
// import { User } from './user';

// @Entity("student")
// export class Student extends BaseEntity {
//   @PrimaryGeneratedColumn("uuid")
//   studentId!: string;

//   @Column({ type: "varchar", length: 128, nullable: true })
//   lastName!: string;

//   @Column({ type: "varchar", length: 128, nullable: true })
//   firstName!: string;
//   @Column({ type: "varchar", length: 128, nullable: true })
//   email!: string;

//   @Index()
//   @ManyToOne(() => User, { nullable: false })
//   @JoinColumn({ name: 'parentId' })
//   parent!: User

//   @RelationId((student: Student) => student.parent)
//   parentId!: string

//   @Index()
//   @OneToOne(() => User, { nullable: false })
//   @JoinColumn({ name: 'userId' })
//   user!: User

//   @RelationId((student: Student) => student.user)
//   userId!: string


//   @Index()
//   @ManyToOne(() => Level, { nullable: false })
//   @JoinColumn({ name: 'levelId' })
//   level!: Level

//   @RelationId((student: Student) => student.level)
//   levelId!: string
// }
