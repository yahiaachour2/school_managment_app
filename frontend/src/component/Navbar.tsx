import React, {
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { jwtDecode } from 'jwt-decode';
import {
  LogOut,
  Package,
  Settings,
  ShoppingCart,
} from 'react-feather';

import useClickOutside from '../helpers/useClickOutside';

interface DropdownProps {
  children: ReactNode;
  trigger: ReactNode;
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void; // Make onClick optional
}

interface JwtPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  gender: string;
  iat: number;
}

export function Dropdown({ children, trigger }: DropdownProps) {
  const [show, setShow] = useState(false);
  const dropRef = useClickOutside(() => setShow(false));

  return (
    <div className="w-fit relative" ref={dropRef} onClick={() => setShow(curr => !curr)}>
      <div>{trigger}</div>
      {show && (
        <ul className="min-w-max absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow overflow-hidden">
          {children}
        </ul>
      )}
    </div>
  );
}

function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <li
      className="flex gap-3 items-center px-4 py-2 text-gray-800 hover:bg-gray-50 cursor-pointer"
      onClick={onClick} // Use onClick prop here
    >
      {children}
    </li>
  );
}

function Navbar() {
  const [userPhoto, setUserPhoto] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = jwtDecode<JwtPayload>(token);
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
    localStorage.clear()
    window.location.replace('/login'); // Use replace to prevent going back
  };

  return (
    <nav className="bg-gray-50 border-gray-200 dark:bg-gray-900 z-30">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto px-2 p-4 pb-0">
        <a href="http://localhost:5173/users/student" className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* <span className="self-center text-2xl whitespace-nowrap text-blue-500 font-bold dark:text-white">Smart School</span> */}
          <img src="/img/SmartSchool-logo.png" alt="Smart Schoo" className="self-center text-2xl whitespace-nowrap text-blue-500 font-bold dark:text-white w-40 pl-5" />
        </a>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Dropdown trigger={
            <button type="button" className="flex text-sm  rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 pr-8 pb-2" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
              <span className="sr-only">Open user menu</span>
              <img className="w-12 h-15 rounded-full bg-white" src={userPhoto} alt="user photo" />
            </button>
          }>
            <DropdownItem>
              <img src={userPhoto} className='w-12 rounded-full' />
              <div className="py-2">
                <p className="font-medium">{userName}</p>
                <a className="text-sm font-medium text-gray-500">{userEmail}</a>
              </div>
            </DropdownItem>
            <DropdownItem>
              <ShoppingCart size={20} /> Cart
            </DropdownItem>
            <DropdownItem>
              <Package size={20} /> Orders
            </DropdownItem>
            <DropdownItem>
              <Settings size={20} /> Preferences
            </DropdownItem>
            <DropdownItem onClick={handleLogOut}>
              <LogOut size={20} /> Logout
            </DropdownItem>
          </Dropdown>
        </div>
          {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
              </li>
            </ul>
          </div> */}
      </div>
    </nav>
  );
}

export default Navbar;
