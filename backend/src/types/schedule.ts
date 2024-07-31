export interface CreateScheduleInput {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  levelId: string ;
}
  
  export interface GetScheduleInput {
    id: string;
  }
  export interface updateScheduleInput {
   id :string ;
   dayOfWeek: string;
  startTime: string;
  endTime: string;
  }
  export interface deleteScheduleInput {
    id: string;
  }
  