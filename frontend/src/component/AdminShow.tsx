import React, {
  useEffect,
  useState,
} from 'react';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import axiosInstance from '../auth/axios';
import { Admin } from '../types/admin';

function AdminShow() {
  const [formData, setFormData] = useState<Admin>({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    role: 'ADMIN',
    gender: '',
    phone: '',
  });

  const params = useParams<{ userId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/users/${params.userId}`);
        setFormData(response.data.users);
      } catch (error) {
        console.error(`Error fetching Admin with ID ${params.userId}:`, error);
      }
    };

    if (params.userId) {
      fetchAdmin();
    }
  }, [params.userId]);

  const handleBackClick = () => {
    navigate('/admins'); // Adjust the path according to your routing
  };

  const header = (
    <div className='flex justify-end m-4'>
        <div><h3 className='font-semibold text-3xl'>Personal Details</h3></div>
        <button
            type="button"
            onClick={handleBackClick}
            className="text-white bg-red-500 hover:bg-red-500 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
        </button>
    </div>
);

const footer = (
    <div className="flex justify-end">
        <Button
            label="Back"
            severity="secondary"
            icon="pi pi-times"
            style={{ marginLeft: '0.5em', backgroundColor: 'rgb(220, 38, 38)' }}
        />
    </div>
);

// Determine the image source based on gender
const imageSrc = formData.gender === 'MEN'
? '/img/teachermen.png'
: '/img/teacherwomen.png';
return (
    <div className="my-20 flex flex-col m-5 space-y-4 w-full ">
        <div className="flex justify-center ">
            <Card header={header} className="md:w-25rem ">
                <div className='flex space-x-6 items-center'>
                    <div className='min-w-20 min-h-20 w-1/5 h-1/5 border-r-4 rounded-b-lg	 border-gray-300 pr-4'>
                        <img alt="Teacher" src={imageSrc} className="w-4/6 h-4/6  round object-cover" />
                    </div>
                    <div className='flex-1'>
                        <p className="m-0">
                            <ul className="mt-2 text-gray-700">
                                <li className="flex border-y py-2">
                                    <span className="font-bold w-24">Full name:</span>
                                    <span className="text-gray-700">{`${formData.lastName} ${formData.firstName}`}</span>
                                </li>
                                <li className="flex border-b py-2">
                                    <span className="font-bold w-24">Gender:</span>
                                    <span className="text-gray-700">{formData.gender}</span>
                                </li>
                                <li className="flex border-b py-2">
                                    <span className="font-bold w-24">E-mail:</span>
                                    <span className="text-gray-700">{formData.email}</span>
                                </li>
                                <li className="flex border-b py-2">
                                    <span className="font-bold w-24">Mobile:</span>
                                    <span className="text-gray-700">{formData.phone}</span>
                                </li>
                               
                            </ul>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    </div>
);
}

export default AdminShow;
