import * as Yup from 'yup';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import Nav from "../NavBar/Nav";
import React from 'react';
import axios from 'axios';

const RegistrationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Must be 10 digits')
    .required('Contact number is required'),
});

const Register = () => {
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:8082/api/users/register', values);
      alert('Registration successful!');
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Registration failed!');
    }
  };

  return (
    <>
     <Nav></Nav>
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '', contactNumber: '' }}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Field
              name="name"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Field
              name="email"
              type="email"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <Field
              name="password"
              type="password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact Number</label>
            <Field
              name="contactNumber"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="contactNumber" component="div" className="text-red-600 text-sm mt-1" />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded font-semibold"
          >
            Register
          </button>
        </Form>
      </Formik>
    </div>
    </>
  );
};

export default Register;
