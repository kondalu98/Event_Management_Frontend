import { Field, Form, Formik } from 'formik';

import React from 'react';
import axios from 'axios';

const Resets = () => {
  const token = new URLSearchParams(window.location.search).get('token');

  const handleSubmit = async (values) => {
    await axios.post('http://localhost:8082/api/users/reset-password', {
      token,
      newPassword: values.newPassword
    });
    alert('Password reset successful');
  };

  return (
    <Formik initialValues={{ newPassword: '' }} onSubmit={handleSubmit}>
      <Form className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
        <label>New Password</label>
        <Field name="newPassword" type="password" className="input" />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded mt-4">Reset</button>
      </Form>
    </Formik>
  );
};

export default Resets;
