export interface CreateSubjectInput {
    name: string;
    coefficient: string;
    scheduleId :string ;
    userId:string;
    levelId: string;
  }
  export interface GetSubjectInput {
    id: string;
   
  }
  
  export interface updateSubjectInput {
    id: string;
    name: string;
    coefficient: string;
   
  }
  export interface deleteSubjectInput {
    id: string;
   
  }
  