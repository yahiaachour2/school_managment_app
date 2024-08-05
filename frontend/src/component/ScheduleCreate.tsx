import 'react-datepicker/dist/react-datepicker.css';

import {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import DatePicker from 'react-datepicker';
import Select, { SingleValue } from 'react-select';

import axiosInstance from '../auth/axios';
import { ProductFormProps } from '../types/calendar';
import { Level } from '../types/level';
import { Room } from '../types/room';
import { Subject } from '../types/subject';
import { Teacher } from '../types/teacher';

const CreateSéance: React.FC<ProductFormProps> = ({ onClose, event }) => {
  const [error, setError] = useState('');
  const [start, setStart] = useState(event.start);
  const [end, setEnd] = useState(event.end);
  const [levels, setLevels] = useState<Level[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [fullSearchText, setFullSearchText] = useState('');
  const [teacher, setTeacher] = useState<Teacher[]>([]);

  const [formData, setFormData] = useState({
    itemName: '',
    timeStart: '',
    timeEnd: '',
    roomId: '',
    levelId: '',
    subjectId: '',
    userId: '',
    assignedFor: '',
    type: "SCHEDULE"
  });

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        console.log('start', start.toISOString());
        const [levelsResponse, subjectsResponse, roomsResponse,teacherResponse] = await Promise.all([
          axiosInstance.get('http://localhost:3000/level'),
          axiosInstance.get('http://localhost:3000/subject'),
          axiosInstance.get('http://localhost:3000/room/available', {
            params: {
              timeStart: start.toISOString(),
              timeEnd: end.toISOString(),
            },
          }),
          axiosInstance.get('http://localhost:3000/users?page=1&limit=30&role=TEACHER'),

          
       
          
        ]);
        setTeacher(teacherResponse.data);

        setLevels(levelsResponse.data);
        setSubjects(subjectsResponse.data);
        setRooms(roomsResponse.data);
     
        
      } catch (error) {
        console.error('Error fetching levels and parents:', error);
      }
    };

    fetchLevels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      timeStart: start ? start.toISOString() : '',
      timeEnd: end ? end.toISOString() : '',
    };
    try {
      console.log("formData", updatedFormData);
      await axiosInstance.post('http://localhost:3000/calendaritem/schedule', updatedFormData);
      onClose();
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const options = [
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'LEVEL', label: 'Level' },
  ];

  return (
    <div className="p-4 w-full max-w-md max-h-full">
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create New Séance
        </h3>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={onClose}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>
      <form className="p-4 md:p-5" onSubmit={handleSubmit}>
        <div className="grid gap-10 mb-4 grid-cols-2">
        <div className="col-span-1">
            <label htmlFor="subjectId" className="block mb-2 text-sm font-medium text-gray-900">
              Subject:
            </label>
            <Select
              options={subjects.map((subject) => ({ value: subject.subjectId, label: subject.name }))}
              onChange={handleSelectChange('subjectId')}
              onInputChange={handleSearch}
              isSearchable={true}
              styles={customStyles}
              className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-red-500 block w-full"
            />
          </div>
          {/* <div className="col-span-2">
            <label
              htmlFor="itemName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name Subject
            </label>
            <input
              type="text"
              name="itemName"
              id="itemName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type product name"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div> */}
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="timeStart"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Start Time
            </label>
            <DatePicker
              selected={start}
              onChange={(date) => date && setStart(date)}
              timeInputLabel="Time:"
              selectsStart
              startDate={start}
              endDate={end}
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              className="border-solid border-2 border-black-600 w-44"
            />
          </div>
          <div className="col-span-2 h-200 sm:col-span-1">
            <label
              htmlFor="timeEnd"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              End Time
            </label>
            <DatePicker
              selected={end}
              onChange={(date) => date && setEnd(date)}
              timeInputLabel="Time:"
              selectsEnd
              startDate={start}
              endDate={end}
              minDate={start}
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              
              className="border-solid border-2 border-black-600 w-44"
            />
          </div>
        
          <div className="col-span-1">
            <label htmlFor="levelId" className="block mb-2 text-sm font-medium text-gray-900">
              Level:
            </label>
            <Select
              options={levels.map((level) => ({ value: level.levelId, label: level.name }))}
              onChange={handleSelectChange('levelId')}
              onInputChange={handleSearch}
              isSearchable={true}
              styles={customStyles}
              className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="roomId" className="block mb-2 text-sm font-medium text-gray-900">
              Rooms Availables:
            </label>
            <Select
              options={rooms.map((room) => ({ value: room.roomId, label: room.name }))}
              onChange={handleSelectChange('roomId')}
              onInputChange={handleSearch}
              isSearchable={true}
              styles={customStyles}
              className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
            />
          </div>
     
          <div className="col-span-1">
            <label htmlFor="assignedFor" className="block mb-2 text-sm font-medium text-gray-900">
              Teacher:
            </label>
            <Select
          options={teacher.map((user) => ({ value: user.userId, label: `${user.firstName} ${user.lastName}`}))}
          onChange={handleSelectChange('userId')}
          onInputChange={handleSearch}
          isSearchable={true}
          styles={customStyles}
          className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
        />
          </div>
        </div>
        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4 mr-2 -ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 002 0V7zm-1 5a1 1 0 100 2 1 1 0 000-2z"
              clipRule="evenodd"
            />
          </svg>
          Create New
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default CreateSéance;