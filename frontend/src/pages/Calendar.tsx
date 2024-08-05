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
  role: string;
}

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent | null>(null);
  const [updateEvent, setUpdateEvent] = useState<CalendarEvent | null>(null);
  const [role, setRole] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/calendaritem/calendar/?type=CALENDAR');
      const events = response.data.map((event: any) => ({
        id: event.calendarItemId,
        title: event.itemName,
        start: new Date(event.timeStart),
        end: new Date(event.timeEnd),
        type: event.type,
      }));
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = jwtDecode<JwtPayload>(token);
        setRole(parsedToken.role);
        console.log('====================================');
        console.log(parsedToken.role);
        console.log('====================================');
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const onEventResize = useCallback(async (data: any) => {
    if (role !== 'ADMIN') {
      // Notify the user or handle lack of permissions
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
  }, [role]);
  
  const onEventDrop = useCallback(async (data: any) => {
    if (role !== 'ADMIN') {
      // Notify the user or handle lack of permissions
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
  }, [role]);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (role === 'ADMIN') {
        setNewEvent({ start, end, title: '', type: '' });
        setShowModal(true);
      }
    },
    [role]
  );

  const handleEventDoubleClick = useCallback((calEvent: any): void => {
    if (role === 'ADMIN') {
      setUpdateEvent(calEvent);
      setShowModalUpdate(true);
    }
  }, [role]);

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent(null);
    setShowModalUpdate(false);
    setUpdateEvent(null);
    fetchEvents();
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
      />
      {showModal && newEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4" ref={modalRef}>
            <CreateEvent
              onClose={handleCloseModal}
              event={newEvent}
            />
          </div>
        </div>
      )}
      {showModalUpdate && updateEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4" ref={modalRef}>
            <UpdateEvent
              onClose={handleCloseModal}
              event={updateEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
