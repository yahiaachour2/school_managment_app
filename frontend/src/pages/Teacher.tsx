import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import {
  confirmDialog,
  ConfirmDialog,
} from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { FaEdit } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { MdDeleteSweep } from 'react-icons/md';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import axiosInstance from '../auth/axios';

export default function Teacher() {
  // const [customers, setCustomers] = useState([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);
  const [totalPages, setTotalPages] = useState<number>(10);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchData = async (role?: string) => {
    
    try {
      
      let url = `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}`;
      if (role) {
        url += `&role=${role.trim()}`;
      }

      const response = await axiosInstance.get(url);
      setData(response.data);
    } catch (error) {
      setError(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('TEACHER'); // Fetch students by default
  }, [page, limit]);

  const handleDelete = async (userId: string) => {
    console.log();
    
    if (userId) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/delete/${userId}`);
        setData(prevData => prevData.filter(item => item.userId !== userId));
        toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'Student deleted', life: 3000 });
      } catch (error) {
        console.error('Error deleting student:', error);
        setError(`Error deleting document with ID ${userId}: ${JSON.stringify(error, null, 2)}`);
      }
    }
  };

  const confirmDelete = (userId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this student?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(userId),
      reject: () => {
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleClick = (userId: string) => {
    navigate(`/updateteacher/${userId}`);
  };
  const handleClickShow = (userId: string) => {
    navigate(`/showteacher/${userId}`);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          onClick={() => handleClick(rowData.userId)}
          style={{ color: 'blue', backgroundColor: 'transparent', padding: "0.2rem ", border: 'none' }}
        >
          <FaEdit className="text-blue-500" />
        </Button>
        <Button
          onClick={() => handleClickShow(rowData.userId)}
          style={{ color: 'green', backgroundColor: 'transparent', border: 'none', padding: "0.2rem " }}
        >
          <IoEyeSharp className="text-green-500" />
        </Button>
        <Button
          onClick={() => confirmDelete(rowData.userId)}
          style={{ color: 'red', backgroundColor: 'transparent', border: 'none', padding: "0.2rem " }}
        >
          <MdDeleteSweep className="text-red-500" />
        </Button>
      </React.Fragment>
    );
  };
  console.log("sdsddsd",data)

  return (
    <div className="card rounded-md m-6">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className='flex justify-between pr-10'>
        <h3 className='text-3xl m-6'>
          Liste Enseignants
        </h3>
        <Link to="/createteacher">
          <Button label="Add Enseignant" className="m-3 p-button-success" />
        </Link>
      </div>
      <DataTable value={data} paginator rows={50} rowsPerPageOptions={[5, 10, 25, 50]} paginatorClassName=""   style={{ minWidth:'1200px' }}
 >
        <Column field="index" header="No" body={(data, options) => (page - 1) * limit + options.rowIndex + 1}></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="firstName" header="First Name"></Column>
        <Column field="email" header="E-mail"></Column>
      
        <Column field="gender" header="Gender"></Column>
        <Column field="schedule" header="schedule"body={(data) => data.schedule ? data.schedule.scheduleName  : 'N/A'}></Column>

        <Column field="phone" header="Phone"></Column>
        <Column header="Action" body={actionBodyTemplate}></Column>
      </DataTable>
      {error && <div className="p-error">{error}</div>}
    </div>
  );
}
