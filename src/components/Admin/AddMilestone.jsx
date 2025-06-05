import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const validationSchema = Yup.object().shape({
  weekNumber: Yup.number()
    .required('Week number is required')
    .min(1, 'Week number must be between 1 and 52')
    .max(52, 'Week number must be between 1 and 52'),
  content: Yup.string()
    .required('Content is required')
    .min(5, 'Content must be at least 5 characters long')
    .max(500, 'Content must be at most 500 characters long')
});

const AddMilestone = ({ onSuccess }) => {
  const initialValues = {
    weekNumber: '',
    content: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tips/milestone', {
        weekNumber: values.weekNumber,
        content: values.content
      });

      if (response.data.status === 'success') {
        toast.success('Milestone added successfully!');
        resetForm();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add milestone';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Milestone</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Week Number
              </label>
              <Field
                type="number"
                id="weekNumber"
                name="weekNumber"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter week number (1-52)"
              />
              <ErrorMessage
                name="weekNumber"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter milestone content"
              />
              <ErrorMessage
                name="content"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-pink-500 text-white py-2 px-4 rounded-lg transition-colors duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add Milestone'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMilestone;
