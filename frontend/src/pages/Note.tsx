import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router-dom';

import axiosInstance from '../auth/axios';

export default function Note() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);
  const { levelId, subjectId } = useParams();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [level, setLevel] = useState<any>(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (subjectId) {
          const response = await axiosInstance.get(`/subject/getOne/${subjectId}`);
          setSubject(response.data);
        }
        if (levelId) {
          const response = await axiosInstance.get(`/level/getOne/${levelId}`);
          setLevel(response.data);
        }
      } catch (error) {
        console.error('Error fetching subject or level:', error);
        setError('Failed to fetch subject or level data');
      }
    };
    fetchSubject();
  }, [subjectId, levelId]);

  const fetchData = async () => {
    try {
      if (!levelId || !subjectId) return;
      const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/note`, {
        params: { page, limit, subjectId, levelId }
      });
      setData(response.data);
    } catch (error) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, levelId, subjectId]);

  const handleSaveNote = async (row: any) => {
    try {
      const { userId, note, noteId } = row;
      if (!note) throw new Error('Note is required');

      if (noteId) {
        // Update existing note
        await axiosInstance.put(`/note/${noteId}`, { note, userId });
        toast.current?.show({ severity: 'success', summary: 'Note Updated', detail: 'Note updated successfully' });
      } else {
        // Create new note
        if (!subjectId || !levelId) throw new Error('Subject ID and Level ID are required for creating a note');
        await axiosInstance.post('/note', { userId, subjectId, note, levelId });
        toast.current?.show({ severity: 'success', summary: 'Note Added', detail: 'Note added successfully' });
      }

      fetchData(); // Refresh data
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to save note' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, rowData: any) => {
    const { value } = e.target;
    setData(prevData =>
      prevData.map(item => item.userId === rowData.userId ? { ...item, note: value } : item)
    );
  };

  const noteEditor = (rowData: any) => (
    <div className="p-inputgroup">
      <InputText
        value={rowData.note || ''}
        onChange={(e) => handleChange(e, rowData)}
        placeholder="Enter Note"
      />
      <Button label="Save" icon="pi pi-check" onClick={() => handleSaveNote(rowData)} />
    </div>
  );

  return (
    <div className="card rounded-md m-6">
      <Toast ref={toast} />
      <div className='flex justify-between pr-10'>
        <h3 className='text-3xl m-6'>
          List of Students in {subject?.name || 'Loading...'} of level {level?.name || 'Loading...'}
        </h3>
      </div>
      {error && <div className="p-error">{error}</div>}
      <DataTable value={data} paginator rows={50} rowsPerPageOptions={[5, 10, 25, 50]} loading={loading} showGridlines>
        <Column field="index" header="No" body={(data, options) => (page - 1) * limit + options.rowIndex + 1}></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="firstName" header="First Name"></Column>
        <Column header="Note" body={noteEditor}></Column>
      </DataTable>
    </div>
  );
}
