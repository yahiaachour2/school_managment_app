import React from 'react';

import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
// import Teacher from './pages/Teacher';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import CreateAdmin from './component/AdminCreate';
import AdminShow from './component/AdminShow';
import AdminUpdate from './component/AdminUpdate';
import CreateLevel from './component/LevelCreate';
import LevelUpdate from './component/LevelUpdate';
import LisreVoirStudentt from './component/LevelVoirStudent';
import Navbar from './component/Navbar';
import CreateParent from './component/ParentCreate';
import ParentShow from './component/ParentShow';
import ParentUpdate from './component/ParentUpdate';
import Sidebar from './component/Sidebar';
import CreateStudent from './component/StudentCreate';
import StudentShow from './component/StudentShow';
import StudentUpdate from './component/StudentUpdate';
import CreateTeacher from './component/teacherCreate';
import UpdateTeacher from './component/teacherUpdate';
import TeacherShow from './component/TeachrShow';
import Admin from './pages/admin';
import Calendarr from './pages/Calendar';
import Level from './pages/Level';
import Note from './pages/Note';
import Parent from './pages/Parent';
import Schedules from './pages/Schedule';
import Login from './pages/SignIn';
import Student from './pages/Student';
import Teacher from './pages/Teacher';

const AppRouter: React.FC = () => {
  const location = useLocation();

  const noNavbarRoutes = ['/login'];

  const shouldDisplayNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col ">
    <PrimeReactProvider value={{ pt: Tailwind }}>
      {shouldDisplayNavbar && <Navbar />}

      <div className="flex">
        {shouldDisplayNavbar && <Sidebar/>}
        <div className=' flex justify-center w-full'>
        <div className="flex-col items-center justify-center !min-w-[100%]">
          <Routes>
            {/* <Route path="/" element={<Ssxsxsx />} /> */}
            <Route path="/students" element={<Student />} />
            <Route path="/createstudent" element={<CreateStudent />} />
            <Route path="/updateUser/:userId" element={<StudentUpdate />} />
            <Route path="/showUser/:userId" element={<StudentShow />} />


            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/createteacher" element={<CreateTeacher />} />
            <Route path="/updateteacher/:userId" element={<UpdateTeacher />} />
            <Route path="/showteacher/:userId" element={<TeacherShow />} />

            <Route path="/parent" element={<Parent />} />
            <Route path="/createparent" element={<CreateParent />} />
            <Route path="/updateparent/:userId" element={<ParentUpdate />} />
            <Route path="/showparent/:userId" element={<ParentShow />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/createadmin" element={<CreateAdmin />} />
            <Route path="/updateadmin/:userId" element={<AdminUpdate />} />
            <Route path="/showadmin/:userId" element={<AdminShow />} />

            <Route path="/level" element={<Level />} />
            <Route path="/createlevel" element={<CreateLevel />} />
            <Route path="/level/:levelId" element={<LisreVoirStudentt />} />
            <Route path="/updatelevel/:levelId" element={<LevelUpdate />} />

            <Route path="/calendar" element={<Calendarr />} />

            <Route path="/schedule" element={<Schedules />} />


            <Route path="/note" element={<Note />} />



            
          </Routes>
        
        </div>
        </div>
        
      </div>
      
      </PrimeReactProvider>
    </div>
  );
};
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
