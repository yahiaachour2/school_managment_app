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
  const [notes, setNotes] = useState<{ [userId: string]: string }>({});
  const toast = useRef<Toast>(null);
  const { levelId, subjectId } = useParams();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<any>(null);

  // Fetch subject details
  useEffect(() => {
    if (subjectId) {
      const fetchSubject = async () => {
        try {
          const response = await axiosInstance.get(`/subject/getOne/${subjectId}`);
          setSubject(response.data);
        } catch (error) {
          console.error('Error fetching subject:', error);
        }
      };
      fetchSubject();
    }
  }, [subjectId]);

  // Fetch students and their notes
  const fetchData = async () => {
    try {
      if (!levelId) {
        throw new Error('Level ID is missing');
      }

      // Fetch students based on levelId
      const usersUrl = `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}&role=STUDENT&level=${levelId}`;
      const response = await axiosInstance.get(usersUrl);
      setData(response.data);

      // Fetch notes based on subjectId and levelId
      const notesUrl = `/note`;
      const notesResponse = await axiosInstance.get(notesUrl);
      const notesData = notesResponse.data.reduce((acc: any, note: any) => {
        acc[note.user.userId] = note.note;
        return acc;
      }, {});
      setNotes(notesData);
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, levelId, subjectId]);

  // Save a note for a user
  const handleSaveNote = async (userId: string) => {
    if (!subjectId || !levelId) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Subject ID or Level ID is missing' });
      return;
    }

    try {
      const note = notes[userId];
      await axiosInstance.post('/note', {
        userId,
        subjectId,
        note,
        levelId, // Ensure that levelId is included in the request
      });
      toast.current?.show({ severity: 'success', summary: 'Note Added', detail: `Note for ${userId} added successfully` });

      // Optionally update the notes state to reflect the newly added note immediately
      setNotes(prevNotes => ({
        ...prevNotes,
        [userId]: note,
      }));
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add note' });
    }
  };

  const noteEditor = (rowData: any) => (
    <div className="p-inputgroup">
      <InputText
        value={notes[rowData.userId] || ''}
        onChange={(e) => handleNoteChange(rowData.userId, e.target.value)}
        placeholder="Enter Note"
      />
      <Button label="Save" icon="pi pi-check" onClick={() => handleSaveNote(rowData.userId)} />
    </div>
  );

  const handleNoteChange = (userId: string, note: string) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [userId]: note,
    }));
  };

  return (
    <div className="card rounded-md m-6">
      <Toast ref={toast} />
      <div className='flex justify-between pr-10'>
        <h3 className='text-3xl m-6'>
          List of Students in {subject?.name || 'Loading...'} of level {data.length > 0 ? data[0].level.name : 'Loading...'}
        </h3>
      </div>
      <DataTable value={data} paginator rows={50} rowsPerPageOptions={[5, 10, 25, 50]} loading={loading} showGridlines>
        <Column field="index" header="No" body={(data, options) => (page - 1) * limit + options.rowIndex + 1}></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="firstName" header="First Name"></Column>
        <Column header="Note" body={noteEditor}></Column>
      </DataTable>
    </div>
  );
}
