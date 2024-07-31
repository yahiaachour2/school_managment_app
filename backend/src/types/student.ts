import { UserRoles } from './userRoles';

export interface CreateStudentInput {
  lastName: string;
  firstName: string;
  niveau: string;
  password: string;
  role: UserRoles;
  schoolId: string;
  userId: string;
  levelId: string;
  email: string;
  parentId: string;
  scheduleId: string ;
}

export interface GetStudentInput {
  id: string;
  relations?: string[];
}

export interface UpdateStudentInput {
  id: string;
  lastName: string;
  firstName: string;
}

export interface deleteStudentInput {
  id: string;
}
