import React, { useEffect, useState } from "react";
import { Calendar, Bell, Plus, Info, Minus, X } from "lucide-react";
import { BabyIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoaderScreen from "../loaderScreen/loaderScreen";

export default function ChildDashboard() {
    const navigate = useNavigate();
    const [childData, setChildData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    const calculateAge = (birthDate) => {
        const birth = new Date(birthDate);
        const today = new Date();

        // Check if birth date is in the future
        if (birth > today) {
            return "Not born yet";
        }

        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}`;
        } else {
            return `${months} month${months > 1 ? 's' : ''}`;
        }
    };

    useEffect(() => {
        const fetchChildData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/child/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLoading(false);
                console.log(response.data.data);
                setChildData(response.data.data);
                // Set the first child as selected by default
                if (response.data.data && response.data.data.length > 0) {
                    setSelectedChild(response.data.data[0]);
                }
                console.log(childData);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                toast.error("Failed to fetch child data");
                console.log(err);
            }
        };

        fetchChildData();
    }, []);

    const handleRemoveChild = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`http://localhost:8000/api/child/${selectedChild?._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Child removed successfully");
            console.log(res);
            
            setShowRemoveModal(false);
            // Refresh the child list
            const response = await axios.get('http://localhost:8000/api/child/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setChildData(response.data.data);
            if (response.data.data && response.data.data.length > 0) {
                setSelectedChild(response.data.data[0]);
            } else {
                setSelectedChild(null);
            }
        } catch (err) {
            toast.error("Failed to remove child");
            console.error(err);
        }
    };

    if (loading) {
        return <LoaderScreen/>
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
    }
    console.log(selectedChild);

    return (
        <div className="w-full bg-white">
            {/* Remove Child Modal */}
            {showRemoveModal && (
                <div 
                    className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
                    onClick={() => setShowRemoveModal(false)}
                >
                    <div 
                        className="bg-white/95 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Remove Child</h3>
                            <button 
                                onClick={() => setShowRemoveModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to remove <span className="font-bold">{selectedChild?.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowRemoveModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRemoveChild}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 py-40 md:p-8 max-w-7xl mx-auto space-y-6 md:py-40 sm:py-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-2xl shadow">
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                        <span className="text-lg sm:text-xl text-black whitespace-nowrap "> 
                            You have {childData?.length} Registered {childData.length > 1 ? 'children' : 'child'} {childData.length !== 0 ? ':' : ''} 
                        </span>
                        {childData.length === 0 ? (
                            <button 
                                onClick={() => navigate('/add-child')}  
                                className="md:ms-auto  m-auto cursor-pointer flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Child
                            </button>
                        ) : (
                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 w-full sm:w-auto">
                                {childData?.map((child) => (
                                    <div key={child._id}>
                                        <button 
                                            onClick={() => setSelectedChild(child)} 
                                            className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-100 ease-in-out transform hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-opacity-50 ${
                                                selectedChild?._id === child._id 
                                                    ? 'bg-pink-500 text-white' 
                                                    : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                                            }`}
                                        >
                                            {child.name}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {childData.length !== 0 && (
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl shadow bg-white">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{selectedChild?.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        Age: {selectedChild?.birthDate ? calculateAge(selectedChild.birthDate) : "N/A"} &bull; Gender: {selectedChild?.gender} &bull; Blood type: {selectedChild?.bloodType}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4 md:mt-0">
                                <button 
                                    onClick={() => navigate('/add-child')} 
                                    className="cursor-pointer flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Child
                                </button>
                                <button 
                                    onClick={() => setShowRemoveModal(true)} 
                                    className="cursor-pointer flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                >
                                    <Minus className="w-4 h-4 mr-2" /> Remove Child
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-2xl shadow space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Vaccination Summary</h3>
                                    <div className="space-x-2">
                                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-gray-200">All</button>
                                        <button className="px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">Upcoming</button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-600">Latest Taken</p>
                                    <p className="text-sm">MMR Vaccine</p>
                                    <p className="text-xs text-gray-500">Taken on April 10, 2025</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-yellow-600">Upcoming</p>
                                    <p className="text-sm">DPT Booster</p>
                                    <p className="text-xs text-gray-500">Scheduled for May 15, 2025</p>
                                </div>
                                <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                                    View Full Vaccination History
                                </button>
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow space-y-4">
                                <h3 className="font-semibold text-lg">Vaccine Requests</h3>
                                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium">Hepatitis B Vaccine</p>
                                        <p className="text-xs text-gray-500">April 25, 2025 • City Hospital</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded">Pending</span>
                                        <button className="text-red-500 hover:text-red-700">✕</button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-3 bg-white p-4 rounded-2xl shadow space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">Purchased Products</h3>
                                    <a href="#" className="text-sm text-blue-600 hover:underline">View All Orders</a>
                                </div>
                                <div className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium">Baby Formula XYZ</p>
                                        <p className="text-xs text-gray-500">Purchased on April 15, 2025</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm">Qty: 2</p>
                                        <button
                                            className="flex items-center gap-1 text-sm text-pink-500 cursor-pointer hover:text-pink-600"
                                            onClick={() => navigate('/review')}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                />
                                            </svg>
                                            Write Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}