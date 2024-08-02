import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/login`,
        {
          email: email,
          password: password
        },
        { withCredentials: true }
      );
      const { token } = response.data;
      console.log('Login Successful. Token:', token);
      localStorage.setItem('authToken', token);
      navigate('/home-backend');
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <div className='bg-secondary min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full sm:w-96'>
        <h1 className='text-3xl text-center mb-8'>Sign In</h1>
        <form className='space-y-4' onSubmit={handleLogin}>
          <div>
            <input
              type='text'
              id='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='Enter your Email'
              required
            />
          </div>
          <div>
            <input
              type='password'
              id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='Enter your password'
              required
            />
          </div>
          <div className='flex justify-center'> {/* Center aligns the button */}
          <button
            type='submit'
            className='py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Sign In
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
