import {
  useEffect,
  useState,
} from 'react';

import { jwtDecode } from 'jwt-decode';
import { FaBook } from 'react-icons/fa6';
import {
  GrSchedules,
  GrUserAdmin,
} from 'react-icons/gr';
import {
  IoIosArrowDropleftCircle,
  IoIosNotifications,
} from 'react-icons/io';
import {
  IoCalendarNumberOutline,
  IoSchoolSharp,
} from 'react-icons/io5';
import {
  MdOutlineSpeakerNotes,
  MdPeopleAlt,
} from 'react-icons/md';
import { PiStudentBold } from 'react-icons/pi';
import { RiParentFill } from 'react-icons/ri';
import { SiGoogleclassroom } from 'react-icons/si';
import {
  Link,
  useLocation,
} from 'react-router-dom';

interface JwtPayload {
  role: string;
}

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [role, setRole] = useState('');

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parsedToken = jwtDecode<JwtPayload>(token);
        setRole(parsedToken.role);
        
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    // Set the initial state based on the current window width
    handleResize();

    // Add the resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Menus = [
    { title: "Student", icon: <PiStudentBold  className='size-7'/>, link: "/students", roles: ['ADMIN'] },
    { title: "Enseignant", icon: <MdPeopleAlt  className='size-7'/>, link: "/teacher", roles: ['ADMIN'] },
    { title: "Parent", icon: <RiParentFill  className='size-7'/>, link: "/parent", roles: ['ADMIN'] },
    { title: "Room", icon: <SiGoogleclassroom  className='size-7'/>, link: "/room", roles: ['ADMIN'] },

    { title: "Admin", icon: <GrUserAdmin  className='size-7'/>, link: "/admin", roles: ['ADMIN'] },
    
    { title: "Room", icon: <SiGoogleclassroom  className='size-7'/>, link: "/room",  gap: true, roles: ['ADMIN'] },

    { title: "Inbox", icon: <IoIosNotifications  className='size-7'/>, link: "/inbox", roles: ['ADMIN', 'TEACHER', 'PARENT','STUDENT'] },
    { title: "Level", icon: <IoSchoolSharp  className='size-7'/>, link: "/level", roles: ['ADMIN'] },
    { title: "Subject", icon: <FaBook  className='size-7'/>, link: "/subject", roles: ['ADMIN'] },

    { title: "Note", icon: <MdOutlineSpeakerNotes  className='size-7'/>, link: "/note", roles: ['ADMIN', 'TEACHER'] },
    
    { title: "Schedule", icon: <GrSchedules  className='size-7'/>, link: "/schedule", gap: true, roles: [ 'ADMIN','TEACHER','PARENT','STUDENT'] },
    { title: "Calendar", icon: <IoCalendarNumberOutline  className='size-7'/>, link: "/calendar", roles: ['ADMIN', 'TEACHER', 'PARENT','STUDENT'] },
  ];

  return (
    <div className="flex">
      <div className={`bg-gray-50 relative p-5 text-white h-screen ease-in-out duration-300 w-28 ${
        open ? "w-64" : "translate-x-0"
      }`}>
        <IoIosArrowDropleftCircle
          className={`absolute cursor-pointer -right-3 top-8 text-blue-500 rounded-full h-10 w-10 ease-in-out duration-500 ${
            !open && "-rotate-90"
          } hover:drop-shadow-2xl hover:shadow-2xl`}
          onClick={() => setOpen(!open)}
        />
        <ul className="pt-0">
          {Menus.map((Menu, index) => (
            Menu.roles.includes(role) && (
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer text-xl ms-3 font-medium text-gray-900 dark:text-white dark:hover:bg-gray-700 group items-center gap-x-4 
                  ${Menu.gap ? "mt-9" : "mt-2"} ${location.pathname === Menu.link ? "bg-gray-200 text-gray-900" : ""}`}
              >
                <Link to={Menu.link} className="flex items-center gap-x-4">
                  {Menu.icon}
                  <span className={`${open ? "inline" : "hidden"} origin-left ease-in-out duration-300`}>
                    {Menu.title}
                  </span>
                </Link>
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
