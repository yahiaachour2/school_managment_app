import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
import Select, { SingleValue } from 'react-select';

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
  const [view, setView] = useState(Views.WEEK)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [fullSearchText, setFullSearchText] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [teacher, setTeacher] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState({
    itemName: '',
    timeStart: '',
    timeEnd: '',
    roomId: '',
    levelId: '',
    subjectId: '',
    userId: '32096a76-4798-44d4-b840-11107c6983c4',
    assignedFor: '',
    type: "SCHEDULE"
  });

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/calendaritem/?type=SCHEDULE');
      const events = response.data.map((event: any) => ({
        id: event.calendarItemId,
        // title: event.subject.name,


        title: (
          <div className='flex flex-col justify-center gap-y-6 items-start mt-0 h-full'>
            <div >
              {event.subject.name}
            </div>
            <div >
              {event.teacher.firstName} {event.teacher.lastName}
            </div>
          </div>
        ),
        description: "event.teacher.firstName",
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
    fetchEvents();
  }, []);
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const [levelsResponse, teacherResponse] = await Promise.all([
          axiosInstance.get('http://localhost:3000/level'),
          axiosInstance.get('http://localhost:3000/users?page=1&limit=30&role=TEACHER'),


        ]);

        setLevels(levelsResponse.data);

        setTeacher(teacherResponse.data);
      } catch (error) {
        console.error('Error fetching levels and parents:', error);
      }
    };

    fetchLevels();
  }, []);
  const onEventResize = useCallback(async (data: any) => {
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
  }, []);

  const onEventDrop = useCallback(async (data: any) => {
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
    fetchEvents()
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
  const handleSelectChange = (field: string) => (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        [field]: selectedOption.value,
      }));
    }
  };

  // useEffect(() => {
  //   if (showModal || showModalUpdate) {
  //     document.addEventListener('mousedown',(event) => handleClickOutside(event, handleCloseModal, modalRef) );
  //   } else {
  //     document.removeEventListener('mousedown', (event) => handleClickOutside(event, handleCloseModal, modalRef));
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', (event) => handleClickOutside(event, handleCloseModal, modalRef));

  //   };
  // }, [showModal, showModalUpdate]);

  return (

    <div className="Schedules">
      <div className='flex  justify-evenly space-x-10'>
        <div className='w-1/2'> 
           <div>
            <h3>Schedule for Teacher :</h3>
           </div>  
           <Select
          options={teacher.map((user) => ({ value: user.teacherId, label: `${user.firstName} ${user.lastName}`}))}
          onChange={handleSelectChange('userId')}
          onInputChange={handleSearch}
          isSearchable={true}
          styles={customStyles}
          className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
        /></div>


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
          /></div>
      </div>
      <DnDCalendar
        components={{
          toolbar: () => null,  // Hides the toolbar

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
        style={{ height: '94vh' }}
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
