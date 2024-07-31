// level.ts
export interface Level {
    levelId: string;
    name: string;
  }
  
  // children.ts
  export interface Children {
    userId: string;

    firstName: string;
    lastName: string;
  }
  
  // parent.ts

  
  export interface Parent {
    lastName: string;
    firstName: string;
    userId: string;
    email: string;
    password: string;
    role: 'STUDENT';
    levelId: string;
    parentId: string;
    schoolId: string;
    gender: string;
    phone: string;
    level: Level;
    children: Children[]; // Corrected children type
  }
  