import React, { useState, useEffect } from "react";
import { Info, Heart, Leaf, Smile } from "lucide-react";
import axios from "axios";

export default function PregnancyTips() {
    const [tips, setTips] = useState([]);
    // const [Trimester, setTrimester ] = useState([])
    // const [Foods, setFoods] = useState([]);
    const [Milestone, setMilestone] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const token = localStorage.getItem('token');
                // console.log("Token from localStorage:", token);

                if (!token) {
                     setError("Please log in to view pregnancy tips");
                     setLoading(false);
                     return;
                 }

                const response = await axios.get("http://localhost:8000/api/tips", {
                    headers: {
                        'Content-Type': 'application/json',

                    }
                });
                
                // console.log("Response data:", response.data);
                console.log(response)
                if (response.data.data) {
                    setTips(response.data.data.pregnancyTips);
                    // setTips(response.data.data.Trimester);
                    // setTips(response.data.data.Foods);
                    setMilestone(response.data.data.Milestone);

                } else {
                    setError("No data received from the server");
                }
            } catch (err) {
                // console.log("Error details:", err.response?.data);
                // console.log("Error status:", err.response?.status);
                // console.log("Error headers:", err.response?.headers);
                
                if (err.response) {
                    if (err.response.status === 401) {
                        setError("Your session has expired. Please log in again.");
                         localStorage.removeItem('token');
                    } else {
                        setError(`Server Error: ${err.response.data?.message || 'Something went wrong'}`);
                    }
                } else if (err.request) {
                    setError("No response from server. Please check your internet connection.");
                } else {
                    setError("Error: " + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchTips();

        // Set up polling interval (e.g., every 30 seconds)
        const intervalId = setInterval(fetchTips, 30000); // 30000ms = 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);

    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    if (loading) {
        return (
            <div className="py-30">
                <div className="p-4 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <p className="text-center">Loading pregnancy tips...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-30">
                <div className="p-4 max-w-5xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-30">
            <div className="p-4 max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
                <div> 

                </div>
                <h2 className="text-2xl font-semibold">Pregnancy Tips</h2>
                   { tips.length>0 && tips.map((tip, index) => (   
                      <p key={index} className="text-sm text-gray-500">{tip.title}: {tip.content}</p> )) }
                    <div className="text-pink-500">
                        <Info className="w-6 h-6" />
                    </div>
                </div>

                {/* Tips Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tips?.generalTips?.map((tip, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow space-y-2">
                            <h3 className="text-lg font-semibold">{tip.title}</h3>
                            <p className="text-sm text-gray-600">{tip.content}</p>
                        </div>
                    ))}
                </div>

                {/* Trimester Checklist */}
                <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                    <h3 className="text-xl font-semibold">Trimester Checklist</h3>
                    <div className="space-y-4">
                        {tips?.trimesterChecklist?.map((trimester, index) => (
                            <div key={index} className="border-b pb-4 last:border-b-0">
                                <p className={`font-medium ${getTrimesterColor(index)}`}>
                                    Trimester {trimester.number}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">{trimester.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Foods */}
                <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                    <h3 className="text-xl font-semibold">Recommended Foods</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tips?.recommendedFoods?.map((food, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                                {food.image && (
                                    <img 
                                        src={food.image} 
                                        alt={food.name} 
                                        className="w-full h-24 object-cover rounded-lg mb-2"
                                    />
                                )}
                                <p className="text-sm font-medium">{food.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Milestones */}
                <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                    <h3 className="text-xl font-semibold">Weekly Milestones</h3>
                    <div className="space-y-4">
                        {Milestone?.map((milestone, index) => (
                            <p key={index} className="text-sm text-gray-500">Week {milestone.weekNumber}: {milestone.content}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const getTrimesterColor = (index) => {
    const colors = ['text-pink-600', 'text-yellow-600', 'text-green-600'];
    return colors[index] || colors[0];
};