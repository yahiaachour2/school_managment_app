export interface Level {
  levelId: string;
  name: string;
}
export interface Parent {
  userId: string; // Use this instead of parentId if it’s the unique identifier
  firstName: string;
  lastName: string;
}

export interface Student {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  role: 'STUDENT';
  levelId: string;
  parentId: string; // Make sure this is correctly used in your code
  schoolId: string;
  gender: string;
  phone: string;
  level: Level;
  parent: Parent;
}