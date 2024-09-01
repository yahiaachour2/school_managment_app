import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { jwtDecode } from 'jwt-decode';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';

import axiosInstance from '../auth/axios';

interface JwtPayload {
  role: string;
  userId: string;
  levelId?: string;
}

interface NoteData {
  firstName: string;
  lastName: string;
  note: string;
  userId: string;
  noteId: string;
}

const NotesForStudent: React.FC = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const toast = useRef<Toast>(null);

  // Function to fetch notes
  const fetchNotes = async (levelId: string | null, userId: string | null) => {
    if (!levelId || !userId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get('/note/getnoteforuser', {
        params: { levelId, userId }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Unable to fetch notes');
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch notes' });
    } finally {
      setLoading(false);
    }
  };

  // Token and role setup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = jwtDecode<JwtPayload>(token);
        const userId = parsedToken.userId;
        const role = parsedToken.role;

        setRole(role);

        if (role === 'STUDENT' && parsedToken.levelId) {
          setSelectedLevelId(parsedToken.levelId);
          fetchNotes(parsedToken.levelId, parsedToken.userId);
        } else if (role === 'PARENT') {
          // Fetch the parent's information to get the children
          axiosInstance.get(`/users/${userId}`)
            .then(parentResponse => {
              const parent = parentResponse.data.users;
              // Assuming you get the children information here and iterate over them
              parent.children.forEach((child: any) => {
                fetchNotes(child.levelId, child.userId);
              });
            })
            .catch(error => {
              console.error('Error fetching parent data:', error);
              setError('Unable to fetch parent data');
              toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Unable to fetch parent data' });
            });
        }
      } catch (error) {
        console.error('Invalid token', error);
        setError('Invalid token');
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid token' });
      }
    } else {
      setError('No token found');
    }
  }, []);

  // Template for rendering note data
  const noteBodyTemplate = (rowData: NoteData) => (
    <div className='flex items-center space-x-2'>
      <p>{rowData.note}</p>
    </div>
  );

  return (
    <div className="card rounded-md m-6 min-w-full">
      <Toast ref={toast} />
      <div className="flex justify-between pr-10">
        <h3 className="text-3xl m-6">Subject Notes</h3>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-4">Loading...</div>
      ) : error ? (
        <div className="flex justify-center items-center p-4 text-red-600">{error}</div>
      ) : (
        <DataTable
          value={notes}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column field="subjectName" header="Subject Name" />
          <Column field="coefficient" header="Coefficient" />
          <Column field="note" header="Note" body={noteBodyTemplate} />
        </DataTable>
      )}
    </div>
  );
};

export default NotesForStudent;
