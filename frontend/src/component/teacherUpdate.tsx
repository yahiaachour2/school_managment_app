import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Select, { SingleValue } from 'react-select';

import axiosInstance from '../auth/axios';
import { Level } from '../types/level';
import {
  FormateScheduleResponse,
  Schedule,
} from '../types/schedule';

// const transformUser = (userData: any) => {
//     return {
//         ...userData,
//         userId: userData.userId,
//         scheduleName: userData.schedule.scheduleName || '' ,
//         gender: userData.gender || '',
//     };
// };

const UpdateTeacher = () => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        role: 'TEACHER',
        // levelId: '',
        schedule: {scheduleId:'',scheduleName:''},
        gender: '',
        phone: '',
    });

    const [error, setError] = useState('');
    const [fullSearchText, setFullSearchText] = useState('');
    const [levels, setLevels] = useState<Level[]>([]);
    const [schedule, setschedule] = useState<FormateScheduleResponse[]>([]);
    const params = useParams<{ userId: string }>();

    const navigate = useNavigate();
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
console.log("form",schedule);

                const response = await axiosInstance.get(`http://localhost:3000/users/get/${params.userId}`);

                // const transformedUser = transformUser(response.data.users);
                setFormData(response.data.users);
            } catch (error) {
                console.error(`Error fetching Student with ID ${params.userId}:`, error);
            }
        };

        if (params.userId) {
            fetchTeacher();
        }
    }, [params.userId]);
    useEffect(() => {
        const fetchLevelsAndschedules = async () => {
            try {
                const [levelsResponse, scheduleResponse] = await Promise.all([
                    axiosInstance.get('http://localhost:3000/level'),
                    axiosInstance.get('http://localhost:3000/schedule'), // Adjust endpoint as necessary
                    // Adjust endpoint as necessary
                ]);
                setschedule(scheduleResponse.data.map((schedule: Schedule) =>{
            if (schedule) {
                    return { label: `${schedule.scheduleName}`, value: schedule.scheduleId }
                } else {
                    return { label: '', value: ''}
                }
                }));
                setLevels(levelsResponse.data);
                
            } catch (error) {
                console.error('Error fetching levels and parents:', error);
            }
        };

        fetchLevelsAndschedules();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearch = (inputValue: string) => {
        setFullSearchText(inputValue);
    };

    const handleSelectChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        if (selectedOption) {
            setFormData((prevState) => ({
                ...prevState,
                scheduleName: selectedOption.value
            }));
        }
    };

    // const handleParentChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    //   if (selectedOption) {
    //     setFormData((prevState) => ({
    //       ...prevState,
    //       parentId: selectedOption.value,
    //       parentName: selectedOption.label
    //     }));
    //   }
    // };
    const handleScheduleChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        if (selectedOption) {
            setFormData((prevState) => ({
                ...prevState,
                scheduleId: selectedOption.value,
                scheduleName: selectedOption.label
                
            }));
        }
    };


    const handleGenderChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        if (selectedOption) {
            setFormData((prevState) => ({
                ...prevState,
                gender: selectedOption.value
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3000/users/', formData);
            navigate('/teacher');
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    const customStyles = {
        container: (provided: any) => ({
            ...provided,
            width: '100%',
        }),
    };

    return (
        <div className="flex flex-col bg-white w-full max-w-4xl mx-auto rounded-2xl p-10 m-6">
            <div className="flex justify-center mb-5">
                <h2 className="text-xl font-bold">Update Enseignant</h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>
                {/* <div className="col-span-1">
              <label htmlFor="levelId" className="block mb-2 text-sm font-medium text-gray-900">Level:</label>
              <Select
                options={levels.map(level => ({ value: level.levelId, label: level.name }))}
                onChange={handleSelectChange}
                onInputChange={handleSearch}
                isSearchable={true}
                styles={customStyles}
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
              />
            </div> */}
                {/* <div className="col-span-1">
              <label htmlFor="parentId" className="block mb-2 text-sm font-medium text-gray-900">Parent:</label>
              <Select
                options={parents.map(parent => ({ value: parent.userId, label: `${parent.firstName} ${parent.lastName}` }))}
                onChange={handleParentChange}
                onInputChange={handleSearch}
                isSearchable={true}
                styles={customStyles}
                className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
              />
            </div> */}
                <div className="col-span-1">
                    <label htmlFor="schedule" className="block mb-2 text-sm font-medium text-gray-900">schedule:</label>
                    <Select
                        options={schedule}
                        value={schedule.find(schedule=>schedule.value === formData?.schedule?.scheduleId) || null}
                        onChange={handleScheduleChange}
                        onInputChange={handleSearch}
                        isSearchable={true}
                        styles={customStyles}
                        className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
                    />
                </div>
                <div className="col-span-1">
                    <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">Gender:</label>
                    <Select
                        onChange={handleGenderChange}
                        value={{ value: formData.gender, label: formData.gender }}

                        options={[
                            { value: '', label: 'Select ...' },
                            { value: 'MEN', label: 'MEN' },
                            { value: 'WOMEN', label: 'WOMEN' },
                        ]}
                        styles={customStyles}
                        className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
                    />
                </div>
                <div className="col-span-1">
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                    />
                </div>
                {error && <div className="col-span-2 text-red-600 mb-5">{error}</div>}
                <div className="col-span-2 flex justify-evenly">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center">
                        Update
                    </button>
                    <Link to="/teacher">
                        <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center">
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default UpdateTeacher;
