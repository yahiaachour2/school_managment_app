import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import axiosInstance from '../auth/axios';

export default function LisreVoirStudentt() {
    const [customers, setCustomers] = useState([]);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(30);
    const [totalPages, setTotalPages] = useState<number>(10);
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const { levelId } = useParams(); 
  
    const fetchData = async (role?: string, level?: string) => {
      try {
        let url = `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}`;
        if (role) {
          url += `&role=${role.trim()}`;
        }
        if (level) {
          url += `&level=${level.trim()}`;
        }
  
        const response = await axiosInstance.get(url);
        setData(response.data);
        console.log("sdsssssata",response.data);

    console.log("dsssata",response.data.level.name);
    
      } catch (error) {
        setError(JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData('STUDENT', levelId); // Fetch students and use levelId from URL
    }, [page, limit, levelId]);
    return (
      <div className="card rounded-md m-6">
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className='flex justify-between pr-10'>
          <h3 className='text-3xl m-6'>
          Liste Students of level {data.length > 0 ? data[0].level.name : 'Loading...'}
          </h3>
          {/* <Link to="/createstudent">
            <Button label="Add Student" className="m-3 p-button-success" />
          </Link> */}
        </div>
        <DataTable value={data} paginator rows={50} rowsPerPageOptions={[5, 10, 25, 50]} paginatorClassName="" >
          <Column field="index" header="No" body={(data, options) => (page - 1) * limit + options.rowIndex + 1}></Column>
          <Column field="lastName" header="Last Name"></Column>
          <Column field="firstName" header="First Name"></Column>
          <Column field="email" header="E-mail"></Column>
          <Column field="parent" header="Parent" body={(data) => data.parent ? `${data.parent.firstName} ${data.parent.lastName}` : 'N/A'}></Column>
          <Column field="gender" header="Gender"></Column>
          <Column field="phone" header="Phone"></Column>
        </DataTable>
      </div>
    );
  }
  