import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';
import Select, {
  MultiValue,
  SingleValue,
} from 'react-select';

import axiosInstance from '../auth/axios';
import { Level } from '../types/level';
import { Subject } from '../types/subject';
import { Teacher } from '../types/teacher';

const CreateSubject = () => {
  const [formData, setFormData] = useState({
    name: '',
    coefficient: '',
    userId: '',
    levelIds: [] as string[],  // Modify this to handle multiple level IDs
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [fullSearchText, setFullSearchText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevelsAndTeachers = async () => {
      try {
        const [levelsResponse, teacherResponse] = await Promise.all([
          axiosInstance.get('http://localhost:3000/level'),
          axiosInstance.get('http://localhost:3000/users?page=1&limit=30&role=TEACHER'),
        ]);

        setTeachers(teacherResponse.data);
        setLevels(levelsResponse.data);
      } catch (error) {
        console.error('Error fetching levels and teachers:', error);
      }
    };

    fetchLevelsAndTeachers();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/subject/', formData);
      navigate('/subject');
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

  const handleSearch = (inputValue: string) => {
    setFullSearchText(inputValue);
  };

  // Handle select changes for single value fields
  const handleSingleSelectChange = (field: string) => (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        [field]: selectedOption.value,
      }));
    }
  };

  // Handle select changes for multiple value fields (for levels)
  const handleMultiSelectChange = (field: string) => (selectedOptions: MultiValue<{ value: string; label: string }>) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: selectedOptions.map((option) => option.value),
    }));
  };

  return (
    <div className="bg-white w-full max-w-4xl mx-auto rounded-2xl p-10 m-6 shadow-lg">
      <div className="flex justify-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Create Subject</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="flex flex-col items-center">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full max-w-md p-2.5"
            required
          />
        </div>

        {/* Coefficient Field */}
        <div className="flex flex-col items-center">
          <label htmlFor="coefficient" className="block mb-2 text-sm font-medium text-gray-900">Coefficient:</label>
          <input
            type="text"
            id="coefficient"
            name="coefficient"
            value={formData.coefficient}
            onChange={handleChange}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full max-w-md p-2.5"
            required
          />
        </div>

        {/* Teacher Select */}
        <div className="flex flex-col items-center">
          <label htmlFor="userId" className="block mb-2 text-sm font-medium text-gray-900">Teacher:</label>
          <Select
            options={teachers.map((user) => ({ value: user.userId, label: `${user.firstName} ${user.lastName}` }))}
            onChange={handleSingleSelectChange('userId')}
            onInputChange={handleSearch}
            isSearchable={true}
            styles={customStyles}
            className="w-full max-w-md"
          />
        </div>

        {/* Level Multi-Select */}
        <div className="col-span-1">
          <label htmlFor="levelIds" className="block mb-2 text-sm font-medium text-gray-900">Levels:</label>
          <Select
            options={levels.map((level) => ({ value: level.levelId, label: level.name }))}
            onChange={handleMultiSelectChange('levelIds')}
            onInputChange={handleSearch}
            isMulti={true}  // Enable multiple selection
            isSearchable={true}
            styles={customStyles}
            className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
          />
        </div>

        {/* Error Message */}
        {error && <div className="text-center text-red-600">{error}</div>}

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
          >
            Save
          </button>
       
        </div>
        <div className='col-start-2 '>

          <Link to="/subject" className="text-gray-600 hover:text-gray-900 font-medium text-sm px-5 py-2.5 mr-2 mb-2">
          <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5   mr-2 mb-2 text-center">

            Cancel          </button>

          </Link>

          </div>
      </form>
    </div>
  );
};

export default CreateSubject;
