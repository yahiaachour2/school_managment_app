import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import {
  Calendar,
  momentLocalizer,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';

import axiosInstance from '../auth/axios';
import CreateEvent from '../component/EventCreate';
import UpdateEvent from '../component/EventUpdate';
import { CalendarEvent } from '../types/calendar';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

interface JwtPayload {
  level: string;
  role: string;
  userId: string;
}

const CalendarAbsenceForStudent: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent | null>(null);
  const [updateEvent, setUpdateEvent] = useState<CalendarEvent | null>(null);
  const [role, setRole] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchEventsAndAbsences = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = jwtDecode<JwtPayload>(token);
        const userId = parsedToken.userId;
        const role = parsedToken.role;

        const combinedEvents: CalendarEvent[] = [];

        if (role === 'PARENT') {
          // Fetch the parent's information to get the children
          const parentResponse = await axiosInstance.get(`/users/${userId}`);
          const parent = parentResponse.data.users;

          if (parent.children && parent.children.length > 0) {
            const childrenIds = parent.children.map((child: any) => child.userId);
            console.log('childrenIds', childrenIds);

            for (const childId of childrenIds) {
              // Fetch absences specific to each child
              const absencesResponse = await axiosInstance.get('/calendaritem/calendar', {
                params: {
                  type: 'CALENDAR',
                  userId: childId,
                },
              });

              const absences = absencesResponse.data.map((event: any) => ({
                id: event.calendarItemId,
                title: (
                  <div className="flex flex-col justify-center min-w-max items-start mt-0 h-full">
                    <div>
                      Absence for {event.student?.firstName} {event.student?.lastName}
                    </div>
                    <div>Subject: {event.subject?.name}</div>
                  </div>
                ),
                start: new Date(event.timeStart),
                end: new Date(event.timeStart),
                type: event.type,
                eventType: event.eventType,
              }));

              console.log(`Absences for child ${childId}`, absences);
              combinedEvents.push(...absences);
            }
          } else {
            console.log('No children found for the parent.');
          }
        } else if (role === 'STUDENT') {
          // Fetch absences specific to the student
          const absencesResponse = await axiosInstance.get('/calendaritem/calendar', {
            params: {
              type: 'CALENDAR',
              userId: userId,
            },
          });

          const absences = absencesResponse.data.map((event: any) => ({
            id: event.calendarItemId,
            title: (
              <div className="flex flex-col justify-center min-w-max items-start mt-0 h-full">
                <div>
                  Absence for {event.student?.firstName} {event.student?.lastName}
                </div>
                <div>Subject: {event.subject?.name}</div>
              </div>
            ),
            start: new Date(event.timeStart),
            end: new Date(event.timeStart),
            type: event.type,
            eventType: event.eventType,
          }));

          combinedEvents.push(...absences);
        }

        // Fetch general events (e.g., school-wide events)
        const eventsResponse = await axiosInstance.get('/calendaritem/calendar', {
          params: {
            type: 'CALENDAR',
            eventType: 'EVENT',
          },
        });

        const events = eventsResponse.data.map((event: any) => ({
          id: event.calendarItemId,
          title: (
            <div className="flex flex-col justify-center items-start mt-0 h-full">
              <div>{event.subject?.name}</div>
              <div>{event.itemName}</div>
              <div>
                {event.student?.firstName} {event.student?.lastName}
              </div>
            </div>
          ),
          start: new Date(event.timeStart),
          end: new Date(event.timeEnd),
          type: event.type,
          eventType: event.eventType,
        }));

        console.log('events', events);

        combinedEvents.push(...events);


        setEvents(combinedEvents);
      } catch (error) {
        console.error('Error fetching events and absences', error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = jwtDecode<JwtPayload>(token);
        setRole(parsedToken.role);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchEventsAndAbsences();
  }, []);

  const onEventResize = useCallback(
    async (data: any) => {
      if (role !== 'ADMIN') {
        alert('You do not have permission to resize events.');
        return;
      }

      const { start, end, event } = data;
      try {
        await axiosInstance.put(`/calendaritem/update/${event.id}`, {
          timeStart: start,
          timeEnd: end,
        });
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.id === event.id ? { ...evt, start, end } : evt
          )
        );
      } catch (error) {
        console.error('Error updating event', error);
      }
    },
    [role]
  );

  const onEventDrop = useCallback(
    async (data: any) => {
      if (role !== 'ADMIN') {
        alert('You do not have permission to move events.');
        return;
      }

      const { start, end, event } = data;
      try {
        await axiosInstance.put(`/calendaritem/update/${event.id}`, {
          timeStart: start,
          timeEnd: end,
        });
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.id === event.id ? { ...evt, start, end } : evt
          )
        );
      } catch (error) {
        console.error('Error updating event', error);
      }
    },
    [role]
  );

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (role === 'ADMIN') {
        setNewEvent({ start, end, title: '', type: '' });
        setShowModal(true);
      }
    },
    [role]
  );

  const handleEventDoubleClick = useCallback(
    (calEvent: any): void => {
      if (role === 'ADMIN') {
        setUpdateEvent(calEvent);
        setShowModalUpdate(true);
      }
    },
    [role]
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent(null);
    setShowModalUpdate(false);
    setUpdateEvent(null);
    fetchEventsAndAbsences();
  };

  const eventStyleGetter = (event: any) => {
    const backgroundColor =
      event.eventType === 'ABSENCE' ? 'rgb(246,0,0)' : 'rgb(61,133,198)';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: 'none',
    };
    return {
      style,
    };
  };

  return (
    <div className="App w-[95%]">
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        events={events}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        selectable
        onDoubleClickEvent={handleEventDoubleClick}
        onSelectSlot={handleSelectSlot}
        style={{ height: '100vh' }}
        eventPropGetter={eventStyleGetter}
      />
      {showModal && newEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4" ref={modalRef}>
            <CreateEvent onClose={handleCloseModal} event={newEvent} />
          </div>
        </div>
      )}
      {showModalUpdate && updateEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4" ref={modalRef}>
            <UpdateEvent onClose={handleCloseModal} event={updateEvent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarAbsenceForStudent;
