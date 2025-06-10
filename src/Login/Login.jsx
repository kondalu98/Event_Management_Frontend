import * as Yup from 'yup';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import Nav from "../NavBar/Nav";
import {Link} from 'react-router-dom';
import React from 'react';
import axios from 'axios';
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm = () => {
  const handleLogin = async (values) => {
    try {
      const res = await axios.post('http://localhost:8082/api/users/login', values);
      alert('Login successful!');
      console.log(res.data); // handle token or session
    } catch (err) {
      console.error(err);
      alert('Invalid credentials');
    }
  };

  return (
    <>
   
   <Nav></Nav>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        <Form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Field name="email" type="email" className="w-full border border-gray-300 px-3 py-2 rounded" />
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <Field name="password" type="password" className="w-full border border-gray-300 px-3 py-2 rounded" />
            <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
          </div>
          <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </Form>
      </Formik>

      {/* New User & Forgot Password Links */}
      <div className="mt-4 text-center">
        <p className="text-sm">
          New user?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-sm mt-1">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default LoginForm;
