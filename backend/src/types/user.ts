import { UserGenders } from './userGendre';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  schoolId: string;
  scheduleId: string;
  parentId :string ;
  levelId: string ;
  gender:UserGenders;
  phone:string;
  
}
export interface GetUserInput {
  id:string
}
export interface UpdateUserInput {
  id:string
  firstName: string;
  lastName: string;

  email: string;
  role: string;
  password: string;
  schoolId: string;
  parentId: string ;
  gender:UserGenders;
  phone:string
  levelId?: string
}
export interface deleteUserInput {
  id:string
}

