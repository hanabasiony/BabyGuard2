"use client"
import { useState, useEffect } from "react"
import axios from "axios"

function TipsArticles() {
  const [activeTab, setActiveTab] = useState("pregnancy-tips")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [tips, setTips] = useState({
    generalTips: [],
    trimesterChecklist: [],
    recommendedFoods: [],
    weeklyMilestones: []
  })

  // Form states
  const [pregnancyTip, setPregnancyTip] = useState({
    title: "",
    content: ""
  })

  const [milestone, setMilestone] = useState({
    weekNumber: "",
    content: ""
  })

  const [trimester, setTrimester] = useState({
    number: "",
    content: ""
  })

  const [recommendedFood, setRecommendedFood] = useState({
    name: "",
    image: null
  })

  // Fetch existing tips
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get("http://localhost:8000/api/tips", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // Ensure we have default values for all arrays
        setTips({
          generalTips: response.data?.generalTips || [],
          trimesterChecklist: response.data?.trimesterChecklist || [],
          recommendedFoods: response.data?.recommendedFoods || [],
          weeklyMilestones: response.data?.weeklyMilestones || []
        })
      } catch (err) {
        console.error("Error fetching tips:", err)
        // Set default empty arrays on error
        setTips({
          generalTips: [],
          trimesterChecklist: [],
          recommendedFoods: [],
          weeklyMilestones: []
        })
      }
    }
    fetchTips()
  }, [])

  const handlePregnancyTipSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post("http://localhost:8000/api/tips/pregnancy-tip", pregnancyTip, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSuccess("Pregnancy tip added successfully!")
      setPregnancyTip({ title: "", content: "" })
      // Update tips state with new data
      setTips(prev => ({
        ...prev,
        generalTips: [...prev.generalTips, response.data]
      }))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add pregnancy tip")
    } finally {
      setLoading(false)
    }
  }

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post("http://localhost:8000/api/tips/milestone", milestone, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSuccess("Milestone added successfully!")
      console.log("Milestone submission response data:", response.data); // Debug log
      setMilestone({ weekNumber: "", content: "" })
      // Update tips state with new data
      setTips(prev => ({
        ...prev,
        weeklyMilestones: [...prev.weeklyMilestones, response.data]
      }))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add milestone")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTrimesterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post("http://localhost:8000/api/tips/trimester", trimester, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setSuccess("Trimester information added successfully!")
      setTrimester({ number: "", content: "" })
      // Update tips state with new data
      setTips(prev => ({
        ...prev,
        trimesterChecklist: [...prev.trimesterChecklist, response.data]
      }))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add trimester information")
    } finally {
      setLoading(false)
    }
  }

  const handleRecommendedFoodSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('name', recommendedFood.name)
      formData.append('image', recommendedFood.image)

      const response = await axios.post("http://localhost:8000/api/tips/recommended-food", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setSuccess("Recommended food added successfully!")
      setRecommendedFood({ name: "", image: null })
      // Update tips state with new data
      setTips(prev => ({
        ...prev,
        recommendedFoods: [...prev.recommendedFoods, response.data]
      }))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add recommended food")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    setRecommendedFood({
      ...recommendedFood,
      image: e.target.files[0]
    })
  }

  // const handleDelete = async (type, id) => {
  //   try {
  //     const token = localStorage.getItem('token')
  //     await axios.delete(`http://localhost:8000/api/tips/${type}/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     })
  //     setSuccess("Item deleted successfully!")
  //     // Update tips state by removing deleted item
  //     setTips(prev => ({
  //       ...prev,
  //       [type]: prev[type].filter(item => item._id !== id)
  //     }))
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to delete item")
  //   }
  // }

import React, { useEffect, useState } from "react";

import { Info, Heart, Leaf, Smile, Trash2, Plus, Minus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TipsArticles = () => {

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [pregnancyTips, setPregnancyTips] = useState([]);
  const [recommendedFoods, setRecommendedFoods] = useState([]);
  const [trimesters, settrimesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTips = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tips');
      setData(response.data.data);
      console.log(response.data.data);

      setMilestones(response.data.data.milestones);
      setPregnancyTips(response.data.data.PregnancyTips);
      setRecommendedFoods(response.data.data.recommendedFoods);
      settrimesters(response.data.data.trimesters);

    } catch (err) {
      setError('Failed to fetch pregnancy tips');
      console.error('Error fetching tips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const token = localStorage.getItem('token')

  const handleDeleteTips = async (id) => {

    try {
      const res = await axios.delete(`http://localhost:8000/api/tips/pregnancy-tip/${id}`,{
        headers:{
           Authorization: `Bearer ${token}`
        }
      });
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success('deleted succesfully')
      console.log(res);
      fetchTips()

    } catch (error) {
      console.error('Error deleting tip:', error);
      setError('Failed to delete pregnancy tip');
    }
  

    
  };

  const handleDeleteTrimester = async (id) => {

    try {
      const res = await axios.delete(`http://localhost:8000/api/tips/trimester/${id}`,{
        headers:{
           Authorization: `Bearer ${token}`
        }
      });
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success('deleted succesfully')
      console.log(res);
      fetchTips()

    } catch (error) {
      console.error('Error deleting tip:', error);
      setError('Failed to delete pregnancy tip');
    }
  

    
  };

  const handleDeleteFood = async (id) => {

    try {
      const res = await axios.delete(`http://localhost:8000/api/tips/recommended-food/${id}`,{
        headers:{
           Authorization: `Bearer ${token}`
        }
      });
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success('deleted succesfully')
      console.log(res);
      fetchTips()

    } catch (error) {
      console.error('Error deleting tip:', error);
      setError('Failed to delete pregnancy tip');
    }
  

    
  };

  const handleDeleteMilestone = async (id) => {

    try {
      const res = await axios.delete(`http://localhost:8000/api/tips/milestone/${id}`,{
        headers:{
           Authorization: `Bearer ${token}`
        }
      });
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success('deleted succesfully')
      console.log(res);
      fetchTips()

    } catch (error) {
      console.error('Error deleting tip:', error);
      setError('Failed to delete pregnancy tip');
    }
  

    
  };

  return (
    <div className="py-10">
      <div className="p-4 max-w-6xl mx-auto space-y-6">
        

        {/* Pregnancy Tips Section */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Pregnancy Tips</h2>
            <p className="text-sm text-gray-500">Helpful advice for a healthy and happy pregnancy</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e)=>{
              e.preventDefault()
              navigate('/admin/tips-articles/add-pregnancytips')
            }} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
              <Plus className="w-5 h-5" />
            </button>
          </div>
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Pregnancy Tips</h1>

      {/* Tabs */}
      <div className="mb-0">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["pregnancy-tips", "milestones", "trimesters", "recommended-foods"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.pregnancyTips.map((tip) => (
            <div key={tip._id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start space-x-3">
                <div className="bg-rose-100 p-2 rounded-full">
                  <Info className="w-4 h-4 text-rose-300" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-medium text-gray-800 mb-1">{tip.title}</h3>
                    <button
                      onClick={() => handleDeleteTips(tip._id)}
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.content}</p>
                </div>
      )}

      {/* Tables */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        {activeTab === "pregnancy-tips" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">

              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.generalTips) && tips.generalTips.map((tip) => (
                  <tr key={tip._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tip.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handlePregnancyTipSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={pregnancyTip.title}
                  onChange={(e) => setPregnancyTip({ ...pregnancyTip, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={pregnancyTip.content}
                  onChange={(e) => setPregnancyTip({ ...pregnancyTip, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows="4"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trimester Checklist */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Trimester Checklist</h3>
            <div className="flex items-center gap-2">
              <button  onClick={(e)=>{
              e.preventDefault()
              navigate('/admin/tips-articles/add-trimeseter')
            }} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(data?.trimesters || {}).map(([trimester, items]) => (
              <div key={trimester} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <p className={`font-medium mb-2 ${
                  trimester === '1' ? 'text-rose-300' :
                  trimester === '2' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {trimester === '1' ? 'First' :
                   trimester === '2' ? 'Second' :
                   'Third'} Trimester
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((item) => (
                    <div key={item._id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-start">
                      <p className="text-sm text-gray-700">{item.content}</p>
                      <button 
                        onClick={() => handleDeleteTrimester(item._id)}
                        className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 ml-2"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Pregnancy Tip"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "milestones" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.weeklyMilestones) && tips.weeklyMilestones.map((milestone) => (
                  <tr key={milestone._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Week {milestone.weekNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleMilestoneSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Week Number</label>
                <input
                  type="number"
                  value={milestone.weekNumber}
                  onChange={(e) => setMilestone({ ...milestone, weekNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={milestone.content}
                  onChange={(e) => setMilestone({ ...milestone, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Milestone"}
              </button>
            </form>
          </div>
        )}

        {/* Recommended Foods */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Recommended Foods</h3>
            <div className="flex items-center gap-2">
              <button  onClick={(e)=>{
              e.preventDefault()
              navigate('/admin/tips-articles/add-recommended-food')
            }} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.recommendedFoods.map((food) => (
              <div key={food._id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1 relative">
                  <img 
                    src={food.imgUrl} 
                    alt={food.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Food+Image';
                    }}
                  />
                  <button 
                    onClick={() => handleDeleteFood(food._id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-medium text-gray-800">{food.name}</p>
                </div>
        {activeTab === "trimesters" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.trimesterChecklist) && tips.trimesterChecklist.map((trimester) => (
                  <tr key={trimester._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Trimester {trimester.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleTrimesterSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trimester Number</label>
                <input
                  type="number"
                  value={trimester.number}
                  onChange={(e) => setTrimester({ ...trimester, number: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  min="1"
                  max="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={trimester.content}
                  onChange={(e) => setTrimester({ ...trimester, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Trimester Information"}
              </button>
            </form>
          </div>
        )}

        {/* Weekly Milestones */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Weekly Milestones</h3>
            <div className="flex items-center gap-2">
              <button  onClick={(e)=>{
              e.preventDefault()
              navigate('/admin/tips-articles/add-milestone')
            }} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                <Plus  className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            {data?.milestones
              .sort((a, b) => a.week - b.week)
              .map((milestone) => (
                <div key={milestone._id} className="flex justify-between items-center">
                  <p>
                    <span className="font-medium text-rose-300">Week {milestone.week}:</span> {milestone.content}
                  </p>
                  <button 
                    onClick={() => handleDeleteMilestone(milestone._id)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 ml-2"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
        {activeTab === "recommended-foods" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.recommendedFoods) && tips.recommendedFoods.map((food) => (
                  <tr key={food._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{food.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleRecommendedFoodSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Food Name</label>
                <input
                  type="text"
                  value={recommendedFood.name}
                  onChange={(e) => setRecommendedFood({ ...recommendedFood, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Food Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-pink-50 file:text-pink-700
                    hover:file:bg-pink-100"
                  accept="image/*"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Recommended Food"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Tables */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        {activeTab === "pregnancy-tips" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">

              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.generalTips) && tips.generalTips.map((tip) => (
                  <tr key={tip._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tip.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handlePregnancyTipSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={pregnancyTip.title}
                  onChange={(e) => setPregnancyTip({ ...pregnancyTip, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={pregnancyTip.content}
                  onChange={(e) => setPregnancyTip({ ...pregnancyTip, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Pregnancy Tip"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "milestones" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.weeklyMilestones) && tips.weeklyMilestones.map((milestone) => (
                  <tr key={milestone._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Week {milestone.weekNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleMilestoneSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Week Number</label>
                <input
                  type="number"
                  value={milestone.weekNumber}
                  onChange={(e) => setMilestone({ ...milestone, weekNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={milestone.content}
                  onChange={(e) => setMilestone({ ...milestone, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Milestone"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "trimesters" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.trimesterChecklist) && tips.trimesterChecklist.map((trimester) => (
                  <tr key={trimester._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Trimester {trimester.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleTrimesterSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trimester Number</label>
                <input
                  type="number"
                  value={trimester.number}
                  onChange={(e) => setTrimester({ ...trimester, number: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  min="1"
                  max="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={trimester.content}
                  onChange={(e) => setTrimester({ ...trimester, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Trimester Information"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "recommended-foods" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(tips?.recommendedFoods) && tips.recommendedFoods.map((food) => (
                  <tr key={food._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{food.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleRecommendedFoodSubmit} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">Food Name</label>
                <input
                  type="text"
                  value={recommendedFood.name}
                  onChange={(e) => setRecommendedFood({ ...recommendedFood, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Food Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-pink-50 file:text-pink-700
                    hover:file:bg-pink-100"
                  accept="image/*"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                {loading ? "Adding..." : "Add Recommended Food"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default TipsArticles
