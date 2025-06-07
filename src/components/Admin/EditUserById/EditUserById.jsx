import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function EditUsersById() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFields, setEditingFields] = useState({});
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to access this page');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        const foundUser = response.data.users.find(user => user._id === userId);
        console.log(response.data);
        if (foundUser) {
          setUser(foundUser);
          console.log(foundUser);
        } else {
          toast.error('User not found');
        }
      } else {
        toast.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch user data');
      }
    } finally {
      setIsLoading(false);
    }
  };
  console.log(userId);
  
  
  const handleEditClick = (field) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: true
    }));
    setEditedValues(prev => ({
      ...prev,
      [field]: user[field]
    }));
  };

  const handleCancelEdit = (field) => {
    setEditingFields(prev => ({
      ...prev,
      [field]: false
    }));
    setEditedValues(prev => {
      const newValues = { ...prev };
      delete newValues[field];
      return newValues;
    });
  };

  const handleSaveEdit = async (field) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to perform this action');
        navigate('/login');
        return;
      }

      const updateData = {
        [field]: editedValues[field]
      };

      const response = await axios.put(`http://localhost:8000/api/user/${userId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        toast.success('User data updated successfully');
        setUser(response.data.user);
        setEditingFields(prev => ({
          ...prev,
          [field]: false
        }));
        setEditedValues(prev => {
          const newValues = { ...prev };
          delete newValues[field];
          return newValues;
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to update user data');
        console.error('Error updating user:', error);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to perform this action');
        navigate('/login');
        return;
      }

      const response = await axios.put(`http://localhost:8000/api/user/${userId}`, editedValues, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        toast.success('All changes saved successfully');
        setUser(response.data.user);
        setEditingFields({});
        setEditedValues({});
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to update user data');
        console.error('Error updating user:', error);
      }
    }
  };

  const hasEdits = Object.keys(editedValues).length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">User not found</div>
        </div>
      </div>
    );
  }

  const editableFields = [
    { key: 'fName', label: 'First Name' },
    { key: 'lName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone Number' },
    { key: 'governorate', label: 'Governorate' },
    { key: 'city', label: 'City' },
    { key: 'role', label: 'Role' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit User Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Update user details below</p>
            </div>
            {hasEdits && (
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save All Changes
              </button>
            )}
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {editableFields.map(({ key, label }) => (
                <div key={key} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">{label}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editingFields[key] ? (
                      <div className="flex items-center space-x-2">
                        {key === 'role' ? (
                          <select
                            value={editedValues[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 sm:text-sm"
                          >
                            <option value="parent">Parent</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={editedValues[key]}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 sm:text-sm"
                            placeholder={`Enter ${label.toLowerCase()}`}
                          />
                        )}
                        <button
                          onClick={() => handleSaveEdit(key)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(key)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span>{user[key]}</span>
                        <button
                          onClick={() => handleEditClick(key)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUsersById;