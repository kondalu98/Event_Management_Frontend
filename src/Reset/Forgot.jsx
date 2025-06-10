import { Field, Form, Formik } from 'formik';

import React from 'react';
import axios from 'axios';

const Forgot = () => {
  const handleSubmit = async (values) => {
  axios.post("http://localhost:8082/api/users/forgot-password", {
  email: values.email
});

  }

  return (
    <Formik initialValues={{ email: '' }} onSubmit={handleSubmit}>
      <Form className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <label>Email</label>
        <Field name="email" type="email" className="input" />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded mt-4">Send Link</button>
      </Form>
    </Formik>
  );
};

export default Forgot;
