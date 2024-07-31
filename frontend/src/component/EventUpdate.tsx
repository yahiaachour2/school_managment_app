import 'react-datepicker/dist/react-datepicker.css';

import {
  useRef,
  useState,
} from 'react';

import {
  confirmDialog,
  ConfirmDialog,
} from 'primereact/confirmdialog';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../auth/axios';
import { ProductFormProps } from '../types/calendar';

const UpdateEvent: React.FC<ProductFormProps> = ({ onClose, event }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useRef(null);

  const { start: startDate, end: endDate, title, type, id ,eventType} = event;

  const [formData, setFormData] = useState({
    itemName: title,
    timeStart: new Date(startDate),
    timeEnd: new Date(endDate),
    description: '',
    type: type,
    eventType: eventType
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      timeStart: formData.timeStart ? (formData.timeStart as Date).toISOString() : '',
      timeEnd: formData.timeEnd ? (formData.timeEnd as Date).toISOString() : '',
    };
    try {
      await axiosInstance.put(`http://localhost:3000/calendaritem/update/${id}`, updatedFormData);
      onClose();
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date, name: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
  };

  const handleDelete = async (calendarItemId: string | undefined) => {
    if (calendarItemId) {
      try {
        await axiosInstance.delete(`http://localhost:3000/calendaritem/delete/${calendarItemId}`);
        onClose();
      } catch (error) {
        console.error('Error deleting calendar item:', error);
        setError(`Error deleting item with ID ${calendarItemId}: ${JSON.stringify(error, null, 2)}`);
      }
    }
  };
  const confirmDeleteEvent = () => {
    confirmDialog({
      message: 'Are you sure you want to delete this event?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(id), 
      reject: () => {
      }
    });
  };
  

  return (
    <div className="p-4 w-full max-w-md max-h-full">
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Update Event
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
      <form className="p-4 md:p-5 " onSubmit={handleSubmit}>
        <div className="grid gap-10 mb-4 grid-cols-2">
          <div className="col-span-2">
            <label
              htmlFor="itemName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              name="itemName"
              id="itemName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type event name"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="timeStart"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Start Time
            </label>
            <DatePicker
              selected={formData.timeStart}
              onChange={(date) => handleDateChange(date as Date, 'timeStart')}
              timeInputLabel="Time:"
              selectsStart
              startDate={formData.timeStart}
              endDate={formData.timeEnd}
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="timeEnd"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              End Time
            </label>
            <DatePicker
              selected={formData.timeEnd}
              onChange={(date) => handleDateChange(date as Date, 'timeEnd')}
              timeInputLabel="Time:"
              selectsEnd
              startDate={formData.timeStart}
              endDate={formData.timeEnd}
              minDate={formData.timeStart}
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Category
            </label>
            <select
              id="type"
              name="type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="EVENT">EVENT</option>
              <option value="ABSENCE">ABSENCE</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row-reverse justify-around">
        <ConfirmDialog />

          <button
          onClick={confirmDeleteEvent}
          type="button"
            className="text-white inline-flex items-center justify-center min-w-40 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Delete Event
          </button>
          <button
            type="submit"
            className="text-white inline-flex items-center min-w-40 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="me-1 -ms-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
