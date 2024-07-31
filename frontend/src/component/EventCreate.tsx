import 'react-datepicker/dist/react-datepicker.css';

import {
  ChangeEvent,
  useState,
} from 'react';

import DatePicker from 'react-datepicker';

import axiosInstance from '../auth/axios';
import { ProductFormProps } from '../types/calendar';

const CreateEvent: React.FC<ProductFormProps> = ({ onClose, event }) => {
    const [error, setError] = useState('');
    const [start, setStart] = useState(event.start);
    const [end, setEnd] = useState(event.end);

    const [formData, setFormData] = useState({
        itemName: '',
        timeStart: '',
        timeEnd: '',
        description: '',
        type: 'CALENDAR',
        eventType: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            timeStart: start ? start.toISOString() : '',
            timeEnd: end ? end.toISOString() : '',
        };
        console.log("updatedFormData",updatedFormData);
        console.log("formData",formData);
        
        try {

            await axiosInstance.post('http://localhost:3000/calendaritem/', updatedFormData);

            onClose()
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

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="p-4 w-full max-w-md max-h-full">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Event
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
                            placeholder="Type product name"
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
                            selected={start}
                            onChange={(date) => date && setStart(date)}
                            timeInputLabel="Time:"
                            selectsStart
                            startDate={start}
                            endDate={end}
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                            className='border-solid border-2 border-black-600 w-44 '
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
                            className='border-solid border-2 border-black-600 w-44 '
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label
                            htmlFor="eventType"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Category
                        </label>
                        <select
                            id="eventType"
                            name="eventType"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={formData.eventType}
                            onChange={handleSelectChange}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="EVENT">EVENT</option>
                            <option value="ABSENCE">ABSENCE</option>
                        </select>
                    </div>
                    {/* <div className="col-span-2">
                        <label
                            htmlFor="description"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Product Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Write product description here"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div> */}
                </div>
                <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                        />
                    </svg>
                    Add new Event
                </button>
                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};

export default CreateEvent;
