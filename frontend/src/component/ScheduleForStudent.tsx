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

export const ScheduleForStudent: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [view, setView] = useState(Views.WEEK);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the user's information to get the role and children
        const userResponse = await axiosInstance.get(`/users/${userId}`);
        const user = userResponse.data.users;

        // Set the student name (can be either parent or student)
        setStudentName(`${user.firstName} ${user.lastName}`);

        // Determine the levelId based on the role
        let levelIdToUse = user.levelId;

        if (user.role === 'PARENT' && user.children.length > 0) {
          // If the user is a parent, use the levelId of the first child
          levelIdToUse = user.children[0].levelId;
        }

        setLevelId(levelIdToUse);

        // Fetch the events based on the levelId
        if (levelIdToUse) {
          const eventsResponse = await axiosInstance.get(`/calendaritem/`, {
            params: {
              type: 'SCHEDULE',
              levelId: levelIdToUse
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
        }
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
      <h2>Schedule for {studentName || 'Loading...'}</h2>
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
