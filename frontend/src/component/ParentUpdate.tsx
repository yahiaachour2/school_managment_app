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
import {
  FormatedLevelResponse,
  Level,
} from '../types/level';
import {
  Parent,
} from '../types/parent'; // Adjust the import to include Children if necessary

const transformUser = (userData: any) => {
  return {
    ...userData,
    userId: userData.userId,
    childrenName: `${userData?.parent?.firstName} ${userData?.parent?.lastName}`,
    gender: userData.gender || '',
  };
};

function ParentUpdate() {
  const [formData, setFormData] = useState<Parent>({
    lastName: '',
    firstName: '',
    userId: '', // Provide a default value for userId
    email: '',
    password: '',
    role: 'STUDENT',
    levelId: '',
    parentId: '',
    schoolId: '',
    children: [], // Corrected default value
    gender: '',
    phone: '',
    level: { levelId: '', name: '' },
  });

  const [error, setError] = useState('');
  const [fullSearchText, setFullSearchText] = useState('');
  const [levels, setLevels] = useState<FormatedLevelResponse[]>([]);
  const [parents, setParents] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const navigate = useNavigate();
  const params = useParams<{ userId: string }>();


  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/users/${params.userId}`);
        const transformedUser = transformUser(response.data.users);
        console.log("response.data.users",response.data.users);
        
        setFormData(transformedUser);
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
        setLevels(levelsResponse.data.map((level: Level) => {
          if (level) {
            return { label: level.name, value: level.levelId }
          } else {
            return { label: '', value: '' }
          }
        }));
        setParents(parentsResponse.data);
        
      } catch (error) {
        console.error('Error fetching levels and parents:', error);
      }
    };

    fetchLevelsAndParents();
  }, []);

  const handleChilderenChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (selectedOption) {
      setFormData((prevState) => ({
        ...prevState,
        userId: selectedOption.value,
        childrenName: selectedOption.label
      }));
    }
  };

  const handleSearch = (inputValue: string) => {
    setFullSearchText(inputValue);
  };

  // const handleScheduleChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
  //   if (selectedOption) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       scheduleId: selectedOption.value,
  //       scheduleName: selectedOption.label,
  //     }));
  //   }
  // };

  const handleSelectChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
    if (!selectedOption) {
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      levelId: selectedOption.value,
      level: {
        levelId: selectedOption.value,
        name: selectedOption.label,
      },
    }));
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
      await axios.put(`http://localhost:3000/users/${params.userId}`, formData);
      navigate('/');
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

  const formatedLevel = (levels: Level[]): FormatedLevelResponse[] => {
    return levels.map((level: Level) => ({ value: level.levelId, label: level.name }));
  };

  return (
    <div className="flex flex-col bg-white w-full max-w-4xl mx-auto rounded-2xl p-10 m-6">
      <div className="flex justify-center mb-5">
        <h2 className="text-xl font-bold">Update Parent</h2>
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
          <label htmlFor="childrenId" className="block mb-2 text-sm font-medium text-gray-900">Children:</label>
          <Select
            options={formData.children.map(child => ({ value: child.userId, label: `${child.firstName} ${child.lastName}` }))}
            onChange={handleChilderenChange}
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
              { value: 'MAN', label: 'MAN' },
              { value: 'WOMAN', label: 'WOMAN' },
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
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none  focus:ring-blue-300 font-medium rounded-lg text-sm  px-10 py-2.5 text-center">
            Update
          </button>
          <Link to="/parent">
            <button type="button" className=" text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-blue-300 font-medium rounded-lg text-sm  px-10 py-2.5 text-center">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ParentUpdate;