import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Select, { SingleValue } from 'react-select';

import axiosInstance from '../auth/axios';
import {
  FormatedLevelResponse,
  Level,
} from '../types/level';
import { Student } from '../types/student';

const transformUser = (userData: any) => {
  return {
    ...userData,
    userId: userData.userId,
    parentName: `${userData?.parent?.firstName || ''} ${userData?.parent?.lastName || ''}`,
    gender: userData.gender || '',
  };
};

function StudentUpdate() {
  const [formData, setFormData] = useState<Student>({
    userId: '',
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    levelId: '',
    parentId: '',
    schoolId: '',
    gender: '',
    phone: '',
    level: { levelId: '', name: '' },
    parent: { userId: '', firstName: '', lastName: '' }, // Ensure this matches the Parent type
  });

  const [error, setError] = useState('');
  const [fullSearchText, setFullSearchText] = useState('');
  const [levels, setLevels] = useState<FormatedLevelResponse[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const navigate = useNavigate();
  const params = useParams<{ userId: string }>();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/users/${params.userId}`);
        const transformedUser = transformUser(response.data.users);
        setFormData((prevState) => ({
          ...prevState,
          ...transformedUser,
          parent: {
            userId: response.data.users.parent?.userId || '',
            firstName: response.data.users.parent?.firstName || '',
            lastName: response.data.users.parent?.lastName || '',
          },
        }));
      } catch (error) {
        console.error(`Error fetching Student with ID ${params.userId}:`, error);
      }
    };

    if (params.userId) {
      fetchDocument();
    }
  }, [params.userId]);

  useEffect(() => {
    const fetchLevelsAndParents = async () => {
      try {
        const [levelsResponse, parentsResponse] = await Promise.all([
          axiosInstance.get('http://localhost:3000/level'),
          axiosInstance.get('http://localhost:3000/users'),
          // axios.get('http://localhost:3000/schedule'), // Adjust endpoint as necessary
        ]);
        setLevels(levelsResponse.data.map((level: Level) => ({
          label: level.name,
          value: level.levelId,
        })));
        setParents(parentsResponse.data);
      } catch (error) {
        console.error('Error fetching levels and parents:', error);
      }
    };

    fetchLevelsAndParents();
  }, []);

  const handleSearch = (inputValue: string) => {
    setFullSearchText(inputValue);
  };

  const handleSelectChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        levelId: selectedOption.value,
        level: {
          levelId: selectedOption.value,
          name: selectedOption.label,
        },
      }));
    }
  };

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
      await axiosInstance.put(`http://localhost:3000/users/${params.userId}`, formData);
      navigate('/students');
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleGenderChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        gender: selectedOption.value,
      }));
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
        <h2 className="text-xl font-bold">Update Student</h2>
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
        <div className="col-span-1">
          <label htmlFor="levelId" className="block mb-2 text-sm font-medium text-gray-900">Level:</label>
          <Select
            onChange={handleSelectChange}
            onInputChange={handleSearch}
            value={levels.find(level => level.value === formData.levelId) || null}
            options={levels}
            styles={customStyles}
            className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="parentName" className="block mb-2 text-sm font-medium text-gray-900">Parent:</label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={`${formData.parent.firstName} ${formData.parent.lastName}`}
            readOnly
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">Gender:</label>
          <Select
            onChange={handleGenderChange}
            value={formData.gender ? { label: formData.gender, value: formData.gender } : null}
            options={[
              { label: 'MAN', value: 'MAN' },
              { label: 'WOMAN', value: 'WOMAN' },
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
        <div className="col-span-2 flex justify-end gap-4">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Update Student
          </button>
          <Link
            to="/students"
            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </Link>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default StudentUpdate;
