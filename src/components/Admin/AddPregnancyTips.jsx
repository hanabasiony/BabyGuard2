import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddPregnancyTips = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters long')
      .max(100, 'Title must be at most 100 characters long'),
    content: Yup.string()
      .required('Content is required')
      .min(5, 'Content must be at least 5 characters long')
      .max(500, 'Content must be at most 500 characters long'),
  });

  const initialValues = {
    title: '',
    content: '',
  };

  const token = localStorage.getItem('token')

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tips/pregnancy-tip',values,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    } );
      toast.success('Pregnancy tip added successfully!');
      resetForm();
      navigate('/admin/tips-articles');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-50 pt-24 pb-12">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="max-w-md mx-auto px-4 sm:px-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Pregnancy Tip</h2>
              
              {/* Title Field */}
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
                  placeholder=" "
                />
                <label htmlFor="title" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Title
                </label>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50"
                />
              </div>

              {/* Content Field */}
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  as="textarea"
                  name="content"
                  id="content"
                  rows="4"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
                  placeholder=" "
                />
                <label htmlFor="content" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Content
                </label>
                <ErrorMessage
                  name="content"
                  component="div"
                  className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50"
                />
              </div>

              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white bg-rose-300 cursor-pointer hover:bg-rose-350 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  {isSubmitting ? 'Adding...' : 'Add Tip'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPregnancyTips;
