import React, {
  useEffect,
  useState,
} from 'react';

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
    userId:'',
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
        const response = await axiosInstance.get(`http://localhost:3000/users/get/${params.userId}`);
        setFormData(response.data.users);
        console.log("sssssssss",response.data.users);
        
      } catch (error) {
        console.error(`Error fetching Student with ID ${params.userId}:`, error);
      }
    };

    if (params.userId) {
        fetchParent();
    }
  }, [params.userId]);

  return (
    <div className="my-20 flex flex-col  space-y-4 ">
      <div className="flex  justify-center">
        <div className="flex-4 bg-white rounded-lg shadow-xl p-8">
          <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
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
              <span className="font-bold w-24">children:</span>
              <span className="text-gray-700">{ formData.children.map((child) => `${child.firstName} ${child.lastName}`).join(', ') }</span>
            </li>
        
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ParentShow;
