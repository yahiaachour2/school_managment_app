export interface CreateCalendarInput {
    calendarId:string
    calendarName: string;
  }
  export interface getCalendarInput {
    id: string;
  }
  
  export interface updateCalendarInput {
    id: string;
    calendarName: string;
  }
  
  export interface deleteCalendarInput {
      id: string;
     
    }