export interface CreateLevelInput {
    levelId:string ;
    name :string
    scheduleId : string ;
  }
  
  export interface GetLevelInput {
    id: string;
  }
  export interface updateLevelInput {
   name :string ;
   levelId: string;
  }
  export interface deleteLevelInput {
    id: string;
  }
  