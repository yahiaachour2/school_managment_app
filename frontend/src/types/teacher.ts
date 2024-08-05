
export interface FormatedScheduleResponse {
  value: string;
  label: string;
}

export interface Teacher {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  userId:string ;
  role: 'TEACHER';
  levelId: string;
  schoolId: string;
  gender: string;
  phone: string;
  schedule: Schedule;
}

interface Schedule {

  scheduleId: string;
  
  scheduleName: string;
  
}