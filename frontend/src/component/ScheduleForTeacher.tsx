import React, {
  useEffect,
  useState,
} from 'react';

import moment from 'moment';
import {
  Calendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useParams } from 'react-router-dom';

import axiosInstance from '../auth/axios';
import { CalendarEvent } from '../types/calendar';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export const ScheduleForTeacher: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [teacherName, setTeacherName] = useState<string | null>(null);
  const [view, setView] = useState(Views.WEEK);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the teacher's information
        const teacherResponse = await axiosInstance.get(`/users/${userId}`);
        const teacher = teacherResponse.data.users;
        setTeacherName(`${teacher.firstName} ${teacher.lastName}`);

        // Fetch the teacher's events
        const eventsResponse = await axiosInstance.get(`/calendaritem/`, {
          params: {
            type: 'SCHEDULE',
            userId: teacher.userId  // Assuming the API expects userId for teacher events
          }
        });

        const events = eventsResponse.data.map((event: any) => ({
          id: event.calendarItemId,
          title: (
            <div className='flex flex-col justify-center items-start mt-0 h-full'>
              <div>{event.subject?.name}</div>
              <div>{event.teacher?.firstName} {event.teacher?.lastName}</div>
              <div>{event.room?.name}</div>
              <div>{event.level?.name}</div>
            </div>
          ),
          start: new Date(event.timeStart),
          end: new Date(event.timeEnd),
          type: event.type,
        }));
        setEvents(events);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <div className='w-full'>
      <h2>Schedule for {teacherName || 'Loading...'}</h2>
      <DnDCalendar
        components={{
          toolbar: () => null,
          header: ({ date }) => <span>{days[moment(date).day()]}</span>,
        }}
        defaultDate={moment().toDate()}
        events={events}
        localizer={localizer}
        resizable
        selectable
        timeslots={1}
        step={60}
        style={{ height: '100vh' }}
        view={view}
        max={moment("2022-10-10T19:00:00").toDate()}
        min={moment("2022-10-10T08:00:00").toDate()}
      />
    </div>
  );
};
