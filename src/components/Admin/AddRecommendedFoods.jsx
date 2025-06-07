import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddRecommendedFoods = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Food name is required")
      .min(3, "Food name must be at least 3 characters long")
      .max(20, "Food name must be at most 20 characters long"),
    image: Yup.mixed()
      .required("Food image is required")
      .test("fileSize", "File size is too large", (value) => {
        if (!value) return true;
        return value.size <= 5000000; // 5MB
      })
      .test("fileType", "Unsupported file type", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }),
  });

  const initialValues = {
    name: "",
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", values.image);

      const response = await axios.post(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/tips/recommended-food",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Recommended food added successfully!");
      resetForm();
      navigate("/admin/tips-articles");
      console.log(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
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
        {({ isSubmitting, setFieldValue }) => (
          <Form className="max-w-md mx-auto px-4 sm:px-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Add Recommended Food
              </h2>

              {/* Food Name Field */}
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Food Name
                </label>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50"
                />
              </div>

              {/* Image Upload Field */}
              <div className="relative z-0 w-full mb-5 group">
                <div className="flex justify-center items-center w-full">
                  <label
                    htmlFor="image"
                    className="w-1/2 mb-2 text-sm font-medium text-gray-900"
                  >
                    Food Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={(event) => {
                      setFieldValue("image", event.currentTarget.files[0]);
                    }}
                    className="w-1/2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-1"
                    accept="image/*"
                  />
                </div>
                <ErrorMessage
                  name="image"
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
                  {isSubmitting ? "Adding..." : "Add Food"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRecommendedFoods;
