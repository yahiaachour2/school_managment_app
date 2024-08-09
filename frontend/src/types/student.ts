export interface Level {
  levelId: string;
  name: string;
}

export interface Parent {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface Student {
  userId: string;
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  role: 'STUDENT';
  levelId: string;
  parentId: string;
  schoolId: string;
  gender: string;
  phone: string;
  level: Level;
  parent: Parent; // Update this line
}
