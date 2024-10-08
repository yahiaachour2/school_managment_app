import React, { useState } from 'react';

import axios from 'axios';
import { AiOutlineTwitter } from 'react-icons/ai';
import { BiLogoFacebook } from 'react-icons/bi';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    server: ''  // Add server error state
  });

  const validate = () => {
    const errors = { email: '', password: '', server: '' };
    let isValid = true;

    // Validate email
    if (!data.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }

    // Validate password
    if (!data.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const result = await axios.post('http://localhost:3000/users/login', data); // Adjust the endpoint as needed
      console.log('result', result);

      const token = result.data.token;
      localStorage.setItem('token', token);
      console.log('Login successful');
      window.location.href = '/students';
    } catch (error: any) {
      console.error('Login failed', error);

      // Handle server-side errors
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        setErrors(prevErrors => ({
          ...prevErrors,
          server: message || 'Login failed. Please try again.'
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          server: 'An unexpected error occurred. Please try again.'
        }));
      }
    }
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          alt="Sample image"
        />
      </div>
      <div className="md:w-1/3 max-w-sm">
        <div className="text-center md:text-left">
          <label className="mr-1">Sign in with</label>
          <button
            type="button"
            className="mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <BiLogoFacebook size={20} className="flex justify-center items-center w-full" />
          </button>
          <button
            type="button"
            className="inline-block mx-1 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
          >
            <AiOutlineTwitter size={20} className="flex justify-center items-center w-full" />
          </button>
        </div>
        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-semibold text-slate-500">Or</p>
        </div>
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          name="email"
          value={data.email}
          onChange={handleInputChange}
          placeholder="Email Address"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          name="password"
          value={data.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        {errors.server && <p className="text-red-500 text-sm mt-1">{errors.server}</p>}
        <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
            <input className="mr-1" type="checkbox" />
            <span>Remember Me</span>
          </label>
        </div>
        <div className="text-center md:text-left">
          <button
            onClick={handleLogin}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
          >
            Login
          </button>
        </div>
        {/* <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don&apos;t have an account?{" "}
          <a
            className="text-red-600 hover:underline hover:underline-offset-4"
            href="#"
          >
            Register
          </a>
        </div> */}
      </div>
    </section>
  );
};

export default Login;
