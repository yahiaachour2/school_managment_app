import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import {
  confirmDialog,
  ConfirmDialog,
} from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import {
  FaEdit,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import axiosInstance from '../auth/axios';

export default function Level() {
  const [customers, setCustomers] = useState([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);
  const [totalPages, setTotalPages] = useState<number>(10);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [levelId, setlevelId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/level?page=${page}&limit=${limit}`);
        setData(response.data);
    
    } catch (error) {
      console.log(error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handleDelete = async (levelId: string) => {
    if (levelId) {
      try {
        await axiosInstance.delete(`/level/delete/${levelId}`);
        setData(prevData => prevData.filter(item => item.levelId !== levelId));
        fetchData()
        toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'Student deleted', life: 3000 });
      } catch (error) {
        console.error('Error deleting student:', error);
        setError(`Error deleting document with ID ${levelId}: ${JSON.stringify(error, null, 2)}`);
      }
    }
  };

  const confirmDelete = (levelId: string) => {
    confirmDialog({
      message: 'Are you sure you want to delete this student?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: ()=> handleDelete(levelId),
      reject: () => {
        setlevelId(null);
        toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleClick = (levelId: string) => {
    navigate(`/updatelevel/${levelId}`);
  };

  const handleClickShow = (userId: string) => {
    navigate(`/showUser/${userId}`);
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
  <Button
          onClick={() => handleClick(rowData.levelId)}
          style={{ color: 'blue', backgroundColor: 'transparent', padding: "0.2rem ", border: 'none' }}
        >
          <FaEdit className="text-blue-500" />
        </Button>
        <Button
          onClick={() => confirmDelete(rowData.levelId)}
          style={{ color: 'red', backgroundColor: 'transparent', border: 'none', padding: "0.2rem " }}
        >
          <MdDeleteSweep className="text-red-500" />
        </Button>
      
      </React.Fragment>
    );
  };
  const linkVoirStudent = (rowData:any) => {
    return (
      <React.Fragment>
        <Link className='flex items-center space-x-2 hover:text-blue-500 hover:underline ' to={`/level/${rowData.levelId}`}>
          <h1 className=''>Voir Listes</h1> 
          <FaExternalLinkAlt />
          </Link>
         

      </React.Fragment>
    );
  };
  const linkVoirSchedule = (rowData:any) => {
    return (
      <React.Fragment>
        <Link className='flex items-center space-x-2 hover:text-blue-500 hover:underline ' to={`/level/${rowData.levelId}`}>
          <h1 className=''>Voir Schedule</h1> 
          <FaExternalLinkAlt />
          </Link>
         

      </React.Fragment>
    );
  };
  return (
    <div className="card rounded-md m-6 min-w-full ">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className=' flex justify-between pr-10'>
        <h3 className='text-3xl m-6'>
          Liste Levels
        </h3>
        <Link to="/createlevel">
          <Button label="Add Level" className="m-3 p-button-success" />
        </Link>
      </div>
      <DataTable value={data} paginator rows={50} rowsPerPageOptions={[5, 10, 25, 50]} paginatorClassName="" className="!min-w-max" >
      <Column field="index" header="No" body={(data, options) => (page - 1) * limit + options.rowIndex + 1}></Column>
        <Column field="name" header=" Name"></Column>
        <Column body={linkVoirStudent}  header=" Liste de Etudiant"></Column>
        <Column  body={linkVoirSchedule} header=" Schedule"></Column>

        <Column header="Action" body={actionBodyTemplate}></Column>
      </DataTable>
      {error && <div className="p-error">{error}</div>}
    </div>
  );
}
