import { AssignedForType } from './assignedForType';
import { EventType } from './eventType';
import { CalendarType } from './itemType';

export interface CreateCalendarItemInput {
  calendarId: string;
  itemName: string;
  timeStart: Date;
  timeEnd: Date;
  eventType: EventType;
  description: string;
  type: CalendarType
}

export interface CreateScheduleItemInput {
  calendarId: string;
  itemName: string;
  timeStart: Date;
  timeEnd: Date;
  userId: string;
  levelId: string;
  subjectId: string;
  roomId: string;
  assignedFor:AssignedForType;
  type: CalendarType


}
export interface getCalendarItemInput {
  id: string;
}

export interface updateCalendarItemInput {
  calendarItemId: string;
  itemName?: string;
  timeStart?: Date;
  timeEnd?: Date;
  description?: string;
  eventType?: EventType;
}
export interface deleteCalendarItemInput {
  id: string;
}
