import {
  useEffect,
  useState,
} from 'react';

import { jwtDecode } from 'jwt-decode';
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

  const Menus = [
    { title: "Student", icon: <PiStudentBold />, link: "/students", roles: ['ADMIN'] },
    { title: "Enseignant", icon: <MdPeopleAlt />, link: "/teacher", roles: ['ADMIN'] },
    { title: "Parent", icon: <RiParentFill />, link: "/parent", roles: ['ADMIN'] },
    { title: "Admin", icon: <GrUserAdmin />, link: "/admin", gap: true, roles: ['ADMIN'] },
    { title: "Inbox", icon: <IoIosNotifications />, link: "/inbox", roles: ['ADMIN', 'TEACHER', 'PARENT','STUDENT'] },
    { title: "Level", icon: <IoSchoolSharp />, link: "/level", roles: ['ADMIN'] },
    { title: "Note", icon: <MdOutlineSpeakerNotes />, link: "/note", roles: ['ADMIN', 'TEACHER'] },
    { title: "Schedule", icon: <GrSchedules />, link: "/schedule", roles: [ 'ADMIN','TEACHER','PARENT','STUDENT'] },
    { title: "Notifications", icon: <IoIosNotifications />, link: "/notification", gap: true, roles: ['ADMIN', 'TEACHER', 'PARENT','STUDENT'] },
    { title: "Calendar", icon: <IoCalendarNumberOutline />, link: "/calendar", roles: ['ADMIN', 'TEACHER', 'PARENT','STUDENT'] },
  ];

  return (
    <div className="flex">
      <div className={` ${open ? "w-full" : "w-25 "} bg-gray-50 h-screen p-5 relative duration-300`}>
        <IoIosArrowDropleftCircle
          className={`absolute cursor-pointer -right-3 top-9 text-blue-500 rounded-full h-10 w-10 ${!open && "-rotate-90"}`}
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
                  <span className={`${!open && "hidden"} origin-left duration-200`}>
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
