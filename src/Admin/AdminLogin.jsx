import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Nav from "../NavBar/Nav";
import { Link } from 'react-router-dom';
import React from 'react';

import { useNavigate } from "react-router-dom";

const adminCredentials = {
  email: "admin",
  password: "admin"
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const AdminLogin = () => {
  const handleLogin = (values) => {
    if (values.email === adminCredentials.email && values.password === adminCredentials.password) {
     
      navigate("/AdminDashboard");
      console.log("Redirecting to admin dashboard...");
      
    
      // Implement redirection logic here
    } else {
      alert("Invalid admin credentials");
    }
  };
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          <Form className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Field name="email"  className="w-full border border-gray-300 px-3 py-2 rounded" />
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

        <div className="mt-4 text-center">
          <p className="text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
