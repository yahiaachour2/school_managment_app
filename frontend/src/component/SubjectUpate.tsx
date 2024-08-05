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

import axiosInstance from '../auth/axios';
import {
  FormatedSubjectResponse,
  Subject,
} from '../types/subject';

function SubjectUpdate() {
        const [formData, setFormData] = useState<Subject>({
            subjectId: '',  
            coefficient:0,
      name:'',
        });
      
        const [error, setError] = useState('');
        const [subjects, setSubjects] = useState<FormatedSubjectResponse[]>([]);
       
        const navigate = useNavigate();
        const params = useParams<{ subjectId: string }>();
      
        console.log("formData", formData);
      
        useEffect(() => {
          const fetchDocument = async () => {
            try {
              const response = await axiosInstance.get(`/subject/getOne/${params.subjectId}`);
              setFormData(response.data);
            } catch (error) {
              console.error(`Error fetching Room with ID ${params.subjectId}:`, error);
            }
          };
      
          if (params.subjectId) {
            fetchDocument();
          }
        }, [params.subjectId]);
      
   
      
    
      
     
      
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
            await axiosInstance.put(`http://localhost:3000/subject/update/${params.subjectId}`, formData);
            navigate('/subject');
          } catch (error) {
            setError('An error occurred. Please try again.');
          }
        };
      
    
      //   const formatedRoom = (levels: Room[]): FormatedRoomResponse[] => {
      //     return rooms.map((room: Room) => ({ value: room.roomId, label: room.name }));
      //   };
      
        return (
            <div className="flex flex-col bg-white w-full max-w-4xl mx-auto rounded-2xl p-10 m-6">
            <div className="flex justify-center mb-5">
              <h2 className="text-xl font-bold">Update Subject   </h2>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="flex items-center col-span-1 justify-center">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 mr-4">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5"
                  required
                />
              </div>
              <div className="flex items-center col-span-1 justify-center">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 mr-4">Coefficient:</label>
                <input
                  type="text"
                  id="coefficient"
                  name="coefficient"
                  value={formData.coefficient}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5"
                  required
                />
              </div>
                     
                      
                      {error && <div className="col-span-2 text-red-600 mb-5">{error}</div>}
                      <div className="col-span-2 flex justify-center space-x-3">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center">
                          Update
                        </button>
                        <Link to="/subject">
                          <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 text-center">
                            Cancel
                          </button>
                        </Link>
                      </div>
                    </form>
                  </div>
        );
      }
      
      export default SubjectUpdate;