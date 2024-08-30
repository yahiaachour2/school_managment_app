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
import CreateRoom from './component/RoomCreate';
import UpdateRoom from './component/RoomUpdate';
import { ScheduleForStudent } from './component/ScheduleForStudent';
import { ScheduleForTeacher } from './component/ScheduleForTeacher';
import Sidebar from './component/Sidebar';
import CreateStudent from './component/StudentCreate';
import StudentShow from './component/StudentShow';
import StudentUpdate from './component/StudentUpdate';
import CreateSubject from './component/SubjectCreate';
import SubjectUpdate from './component/SubjectUpate';
import CreateTeacher from './component/teacherCreate';
import UpdateTeacher from './component/teacherUpdate';
import TeacherShow from './component/TeachrShow';
import { ScheduleForLevel } from './component/VoirScheduleLevel';
import Admin from './pages/admin';
import Calendarr from './pages/Calendar';
import Level from './pages/Level';
import Note from './pages/Note';
import Parent from './pages/Parent';
import Room from './pages/Room';
import Schedules from './pages/Schedule';
import Login from './pages/SignIn';
import Student from './pages/Student';
import Subject from './pages/Subject';
import Teacher from './pages/Teacher';

const AppRouter: React.FC = () => {
  const location = useLocation();

  const noNavbarRoutes = ['/login'];

  const shouldDisplayNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col w-full">
    <PrimeReactProvider value={{ pt: Tailwind }}>
      {shouldDisplayNavbar && <Navbar />}

      <div className="flex w-full">
        {shouldDisplayNavbar && <Sidebar/>}
        <div className=' flex justify-center w-full h-fit  bg-gray-50'>
        {/* <div className=" w-full flex-col items-center justify-center"> */}
          <Routes>
            {/* <Route path="/" element={<Ssxsxsx />} /> */}
            <Route path="/students" element={<Student />} />
            <Route path="/createstudent" element={<CreateStudent />} />
            <Route path="/updateUser/:userId" element={<StudentUpdate />} />
            <Route path="/showUser/:userId" element={<StudentShow />} />
            <Route path="/schedule/student/:userId" element={<ScheduleForStudent />} />


            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/createteacher" element={<CreateTeacher />} />
            <Route path="/updateteacher/:userId" element={<UpdateTeacher />} />
            <Route path="/showteacher/:userId" element={<TeacherShow />} />
            <Route path="/schedule/teacher/:userId" element={<ScheduleForTeacher />} /> {/* Add the route for teachers */}

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
            <Route path="/schedule/level/:levelId" element={<ScheduleForLevel />} />

            <Route path="/calendar" element={<Calendarr />} />

            <Route path="/schedule" element={<Schedules />} />


            <Route path="/note/:levelId/:subjectId" element={<Note />} />

            <Route path="/room" element={<Room />} />
            <Route path="/createroom" element={<CreateRoom />} />
            <Route path="/updateroom/:roomId" element={<UpdateRoom />} />



            <Route path="/subject" element={<Subject />} />
            <Route path="/createsubject" element={<CreateSubject />} />
            <Route path="/updatesubject/:subjectId" element={<SubjectUpdate />} />
            
            


            
          </Routes>
        
        </div>
        {/* </div> */}
        
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
