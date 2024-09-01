import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import { SingleValue } from 'react-select';

import axiosInstance from '../auth/axios';
import { Level } from '../types/level';

export default function Subject() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const fetchData = async (levelId: string | null) => {
    try {
      const response = await axiosInstance.get('/subject/getLevelsForSubject', {
        params: { levelId },
      });
      if (response.data && Array.isArray(response.data)) {
        setData(response.data.map((subjectData: any) => ({
          subjectId: subjectData.subject.subjectId,
          name: subjectData.subject.name,
          levels: subjectData.levels
        })));
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedLevelId);
  }, [selectedLevelId]);

  const handleLevelSelectChange = (selectedOption: SingleValue<{ value: string | null; label: string }>) => {
    setSelectedLevelId(selectedOption ? selectedOption.value : null);
  };

  const nameBodyTemplate = (rowData: any) => {
    return (
      <div className='flex space-x-3'>
        {rowData.levels?.map((level: Record<string, any>, index: number) =>
 <Link
 key={index}
 className='flex items-center space-x-2 hover:text-blue-500 hover:underline'
 to={`/note/${level.levelId}/${rowData.subjectId}`}
>
 <h1 className='  '>{level.name}</h1>
 <FaExternalLinkAlt />
</Link>
        )}
      </div>
    );
  }

  return (
    <div className="card rounded-md m-6 min-w-full">
      <Toast ref={toast} />
      <div className="flex justify-between pr-10">
        <h3 className="text-3xl m-6">List Subject</h3>
        <Link to="/createsubject">
          <Button label="Create Subject" className="m-3 p-button-success" />
        </Link>
      </div>

      {/* <div className="flex m-4 justify-evenly space-x-10">
        <div className="w-1/2">
          <h3> Level:</h3>
          <Select
            options={levels.map((level) => ({ value: level.levelId, label: level.name }))}
            onChange={handleLevelSelectChange}
            isSearchable={true}
            className="bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
          />
        </div>
      </div> */}

      <DataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={loading}
      >
        <Column field="name" header="Name" />
        <Column field="levels" header="Levels" body={nameBodyTemplate} />
      </DataTable>
    </div>
  );
}
