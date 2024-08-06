import React, {
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { jwtDecode } from 'jwt-decode';
import { LogOut } from 'react-feather';

import useClickOutside from '../helpers/useClickOutside';

// Dropdown component
interface DropdownProps {
  children: ReactNode;
  trigger: ReactNode;
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void; // Make onClick optional
}

export function Dropdown({ children, trigger }: DropdownProps) {
  const [show, setShow] = useState(false);
  const dropRef = useClickOutside(() => setShow(false));

  return (
    <div className="relative" ref={dropRef}>
      <div onClick={() => setShow(curr => !curr)}>{trigger}</div>
      {show && (
        <ul className="absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow overflow-hidden w-64">
          {children}
        </ul>
      )}
    </div>
  );
}

function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <li
      className="flex gap-3 items-center justify-center px-4 py-2 text-gray-800 hover:bg-gray-50 cursor-pointer"
      onClick={onClick} // Use onClick prop here
    >
      {children}
    </li>
  );
}

// Navbar component
function Navbar() {
  const [userPhoto, setUserPhoto] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = jwtDecode<any>(token);
        setUserName(`${parsedToken.firstName} ${parsedToken.lastName}`);
        setUserEmail(parsedToken.email);

        if (parsedToken.gender === 'MEN') {
          setUserPhoto('/img/Profile-Male-PNG-removebg-preview (1).png');
        } else if (parsedToken.gender === 'WOMEN') {
          setUserPhoto('/img/219969.png');
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleLogOut = () => {
    console.log("Logging out");
    localStorage.clear();
    window.location.replace('/login'); // Use replace to prevent going back
  };

  return (
    <nav className="bg-gray-50 border-gray-200 dark:bg-gray-900 z-30">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto px-2 p-4 pb-0">
        <a href="http://localhost:5173/users/student" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/img/SmartSchool-logo.png" alt="Smart School" className="w-40 pl-5" />
        </a>
        <div className="flex items-center space-x-7">
          <Dropdown
            trigger={
              <button id="dropdownNotificationButton" className="relative pt-4 inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400">
                <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                  <path d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"/>
                </svg>
                {/* <div className="absolute block w-3 h-3  bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900"></div> */}
              </button>
            }
          >
           <DropdownItem>
  <div className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
    <div className="flex-shrink-0">
      <img className="rounded-full w-11 h-11" src="/img/Profile-Male-PNG-removebg-preview (1).png" alt="Event image" />
      <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-green-500 border border-white rounded-full dark:border-gray-800">
        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 0a1 1 0 0 1 1 1v1h14V1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H3v1a1 1 0 0 1-1 1H0a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1V1a1 1 0 0 1 1-1h2Zm1 4v14h14V4H3Zm1 1h12v12H4V5Z"/>
        </svg>
      </div>
    </div>
    <div className="w-full ps-3">
      <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">Football matches organized at school on <span className="font-semibold text-gray-900 dark:text-white">4 September</span>.</div>
      <div className="text-xs text-blue-600 dark:text-blue-500">3 days ago</div>
    </div>
  </div>
</DropdownItem>

<DropdownItem>
  <div className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
    <div className="flex-shrink-0">
      <img className="rounded-full w-11 h-11" src="/img/Profile-Male-PNG-removebg-preview (1).png" alt="Absence image" />
      <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-yellow-500 border border-white rounded-full dark:border-gray-800">
        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 0a1 1 0 0 1 1 1v1h14V1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H3v1a1 1 0 0 1-1 1H0a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1V1a1 1 0 0 1 1-1h2Zm1 4v14h14V4H3Zm1 1h12v12H4V5Z"/>
        </svg>
      </div>
    </div>
    <div className="w-full ps-3">
      <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
        Notification d'absence : <span className="font-semibold text-gray-900 dark:text-white">Mootez Bouazra</span> est absent le <span className="font-semibold text-gray-900 dark:text-white">25 août en séance Francais</span>.
      </div>
      <div className="text-xs text-blue-600 dark:text-blue-500">1 week ago</div>
    </div>
  </div>
</DropdownItem>

<DropdownItem>
  <div className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
    <div className="flex-shrink-0">
      <img className="rounded-full w-11 h-11" src="/img/Profile-Male-PNG-removebg-preview (1).png" alt="Schedule image" />
      <div className="absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-blue-500 border border-white rounded-full dark:border-gray-800">
        <svg className="w-2 h-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 0a1 1 0 0 1 1 1v1h14V1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1H3v1a1 1 0 0 1-1 1H0a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1V1a1 1 0 0 1 1-1h2Zm1 4v14h14V4H3Zm1 1h12v12H4V5Z"/>
        </svg>
      </div>
    </div>
    <div className="w-full ps-3">
      <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">Schedule update: <span className="font-semibold text-gray-900 dark:text-white">Week exmans</span> Begin <span className="font-semibold text-gray-900 dark:text-white">1 September</span>.</div>
      <div className="text-xs text-blue-600 dark:text-blue-500">2 weeks ago</div>
    </div>
  </div>
</DropdownItem>


            {/* View all link */}
            <DropdownItem>
              <a href="#" className="block  py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
                <div className="inline-flex   items-center ">
                  <svg className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                  </svg>
                  View all
                </div>
              </a>
            </DropdownItem>
          </Dropdown>

          <Dropdown
            trigger={
              <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <img className="w-12 h-13 rounded-full" src={userPhoto} alt="User Photo" />
                <span className="sr-only">Open user menu</span>
              </button>
            }
          >
            <DropdownItem onClick={() => console.log('Profile clicked')}>
              <img className="w-11 h-11 rounded-full" src={userPhoto} alt="User Photo" />
              <div className="w-full ps-3">
                <div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">{userName}</div>
                <div className="text-xs text-blue-600 dark:text-blue-500">{userEmail}</div>
              </div>
            </DropdownItem>
            <DropdownItem onClick={handleLogOut}>
              <LogOut size={20} className="text-gray-600 dark:text-gray-400" />
              <span className="w-full ps-3">Sign out</span>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
