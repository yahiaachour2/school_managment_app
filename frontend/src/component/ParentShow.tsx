import React, {
  useEffect,
  useState,
} from 'react';

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import axiosInstance from '../auth/axios';
import { FormatedLevelResponse } from '../types/level';
import { Parent } from '../types/parent';

function ParentShow() {
  const [formData, setFormData] = useState<Parent>({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    userId: '',
    role: 'STUDENT',
    levelId: '',
    parentId: '',
    schoolId: '',
    gender: '',
    phone: '',
    level: { levelId: '', name: '' },
    children: []
  });
  const params = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [levels, setLevels] = useState<FormatedLevelResponse[]>([]);
  const [parents, setParents] = useState<any[]>([]);

  useEffect(() => {
    const fetchParent = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/users/${params.userId}`);
        setFormData(response.data.users);
      } catch (error) {
        console.error(`Error fetching Student with ID ${params.userId}:`, error);
      }
    };

    if (params.userId) {
      fetchParent();
    }
  }, [params.userId]);

  const handleBackClick = () => {
    navigate('/parent');
  };

  const handleChildClick = (userId: string) => () => {
    navigate(`/showUser/${userId}`);
  };

  const header = (
    <div className='flex justify-end m-4'>
      <div><h3 className='font-semibold text-3xl'>Information details</h3></div>
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
        label="Retour"
        severity="secondary"
        icon="pi pi-times"
        style={{ marginLeft: '0.5em', backgroundColor: 'rgb(220, 38, 38)' }}
      />
    </div>
  );

  return (
    <div className="my-20 flex flex-col m-5 space-y-4">
      <div className="flex justify-center">
        <Card header={header} className="md:w-25rem">
          <div className='flex space-x-6 items-center'>
            <div className='min-w-20 min-h-20 w-1/5 h-1/5 border-r-4 border-gray-300 pr-4'>
              <img alt="Card" src="/img/happy-family-hugs-mom-dad-son-together-graphics-vector.jpg" className="w-full h-full object-cover" />
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
                  <li className="flex border-b py-2">
                    <span className="font-bold w-24">Children:</span>
                    {formData.children.map((child) => (
                      <span 
                        key={child.userId}
                        className="text-gray-700 cursor-pointer underline  hover:text-blue-600" 
                        onClick={handleChildClick(child.userId)}
                      >
                        {child.firstName} {child.lastName}
                        <FaExternalLinkAlt className="inline ml-1" />
                      </span>
                    ))}
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

export default ParentShow;
