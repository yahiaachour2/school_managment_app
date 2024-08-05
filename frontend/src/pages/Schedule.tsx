import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import moment from 'moment';
import {
  Calendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import Select, {
  ActionMeta,
  SingleValue,
} from 'react-select'; // Ensure correct import

import axiosInstance from '../auth/axios';
import UpdateEvent from '../component/EventUpdate';
import CreateSéance from '../component/ScheduleCreate';
import { CalendarEvent } from '../types/calendar';
import { Level } from '../types/level';
import { Teacher } from '../types/teacher';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const Schedules: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [newEvent, setNewEvent] = useState<CalendarEvent | null>(null);
  const [updateEvent, setUpdateEvent] = useState<CalendarEvent | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(Views.WEEK);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [fullSearchText, setFullSearchText] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get(`/calendaritem/`, {
        params: {
          type: 'SCHEDULE',
          userId: selectedUserId || undefined,
          levelId: selectedLevelId || undefined
        }
      });

      const events = response.data.map((event: any) => ({
        id: event.calendarItemId,
        title: (
          <div className='flex flex-col justify-center  items-start mt-0 h-full'>
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
      console.error('Error fetching events', error);
    }
  };
  
  // Fetch events when selectedUserId or selectedLevelId changes
  useEffect(() => {
    fetchEvents();
  }, [selectedUserId, selectedLevelId]);

  // Fetch levels and teachers
  useEffect(() => {
    const fetchLevelsAndTeachers = async () => {
      try {
        const [levelsResponse, teacherResponse] = await Promise.all([
          axiosInstance.get('/level'),
          axiosInstance.get('/users?role=TEACHER')
        ]);

        setLevels(levelsResponse.data);
        setTeachers(teacherResponse.data);
      } catch (error) {
        console.error('Error fetching levels and teachers:', error);
      }
    };

    fetchLevelsAndTeachers();
  }, []);

  // Clear level selection when user is set, and clear user selection when level is set
  useEffect(() => {
    if (selectedUserId) {
      setSelectedLevelId(null);
    }
  }, [selectedUserId]);

  const onEventResize = useCallback(async (data: any) => {
    const { start, end, event } = data;
    try {
      await axiosInstance.put(`/calendaritem/update/${event.id}`, {
        timeStart: start,
        timeEnd: end
      });
      setEvents(prevEvents => prevEvents.map(evt =>
        evt.id === event.id ? { ...evt, start, end } : evt
      ));
    } catch (error) {
      console.error('Error updating event', error);
    }
  }, []);

  const onEventDrop = useCallback(async (data: any) => {
    const { start, end, event } = data;
    try {
      await axiosInstance.put(`/calendaritem/update/${event.id}`, {
        timeStart: start,
        timeEnd: end
      });
      setEvents(prevEvents => prevEvents.map(evt =>
        evt.id === event.id ? { ...evt, start, end } : evt
      ));
    } catch (error) {
      console.error('Error updating event', error);
    }
  }, []);

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      setNewEvent({ start, end, title: '', type: '' });
      setShowModal(true);
    },
    []
  );

  const handleEventDoubleClick = useCallback((calEvent: any): void => {
    setUpdateEvent(calEvent);
    setShowModalUpdate(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent(null);
    setShowModalUpdate(false);
    setUpdateEvent(null);
    fetchEvents();
  };

  const handleSearch = (inputValue: string) => {
    setFullSearchText(inputValue);
  };

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      width: '100%',
    }),
  };

  const handleSelectChange = (field: string) => (selectedOption: SingleValue<{ value: string | null; label: string }>, actionMeta: ActionMeta<{ value: string | null; label: string }>) => {
    if (selectedOption) {
      if (field === 'userId') {
        setSelectedUserId(selectedOption.value as string);
        setSelectedLevelId(null); // Clear the other select
      } else if (field === 'levelId') {
        setSelectedLevelId(selectedOption.value as string);
        setSelectedUserId(null); // Clear the other select
      }
    } else {
      if (field === 'userId') {
        setSelectedUserId(null);
      } else if (field === 'levelId') {
        setSelectedLevelId(null);
      }
    }
  };

  const getTeacherOption = (userId: string | null) => {
    const user = teachers.find((u) => u.userId === userId);
    return user ? { value: user.userId, label: `${user.firstName} ${user.lastName}` } : null;
  };

  const getLevelOption = (levelId: string | null) => {
    const level = levels.find((l) => l.levelId === levelId);
    return level ? { value: level.levelId, label: level.name } : null;
  };

  return (
    <div className="Schedules w-[95%]">
      <div className='flex m-4 justify-evenly space-x-10'>
        <div className='w-1/2'>
          <div>
            <h3>Schedule for Teacher :</h3>
          </div>
          <Select
            options={teachers.map((user) => ({ value: user.userId, label: `${user.firstName} ${user.lastName}` }))}
            onChange={handleSelectChange('userId')}
            onInputChange={handleSearch}
            isSearchable={true}
            styles={customStyles}
            className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
            value={getTeacherOption(selectedUserId)}
          />
        </div>

        <div className='w-1/2'>
          <div>
            <h3>Schedule for Level :</h3>
          </div>
          <Select
            options={levels.map((level) => ({ value: level.levelId, label: level.name }))}
            onChange={handleSelectChange('levelId')}
            onInputChange={handleSearch}
            isSearchable={true}
            styles={customStyles}
            className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
            value={getLevelOption(selectedLevelId)}
          />
        </div>
      </div>

      <DnDCalendar
        components={{
          toolbar: () => null,
          header: ({ date }) => <span>{days[moment(date).day()]}</span>,
        }}
        defaultDate={moment().toDate()}
        events={events}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        selectable
        timeslots={1}
        step={60}
        onDoubleClickEvent={handleEventDoubleClick}
        onSelectSlot={handleSelectSlot}
        style={{ height: '100vh' }}
        view={view}
        max={moment("2022-10-10T19:00:00").toDate()}
        min={moment("2022-10-10T08:00:00").toDate()}
      />

      {showModal && newEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4" ref={modalRef}>
            <CreateSéance
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

export default Schedules;
