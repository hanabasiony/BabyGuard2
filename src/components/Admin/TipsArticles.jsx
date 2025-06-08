import React, { useEffect, useState } from "react";
import { Info, Heart, Leaf, Smile, Trash2, Plus, Minus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";

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
      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/tips"
      );
      setData(response.data.data);
      console.log(response.data.data);

      setMilestones(response.data.data.milestones);
      setPregnancyTips(response.data.data.PregnancyTips);
      setRecommendedFoods(response.data.data.recommendedFoods);
      settrimesters(response.data.data.trimesters);
    } catch (err) {
      setError("Failed to fetch pregnancy tips");
      console.error("Error fetching tips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const token = localStorage.getItem("token");

  const handleDeleteTips = async (id) => {
    try {
      const res = await axios.delete(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/tips/pregnancy-tip/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success("deleted succesfully");
      console.log(res);
      fetchTips();
    } catch (error) {
      console.error("Error deleting tip:", error);
      setError("Failed to delete pregnancy tip");
    }
  };

  const handleDeleteTrimester = async (id) => {
    try {
      const res = await axios.delete(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/tips/trimester/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success("deleted succesfully");
      console.log(res);
      fetchTips();
    } catch (error) {
      console.error("Error deleting tip:", error);
      setError("Failed to delete pregnancy tip");
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      const res = await axios.delete(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/tips/recommended-food/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success("deleted succesfully");
      console.log(res);
      fetchTips();
    } catch (error) {
      console.error("Error deleting tip:", error);
      setError("Failed to delete pregnancy tip");
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      const res = await axios.delete(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/tips/milestone/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the data after successful deletion
      // await fetchTips();
      toast.success("deleted succesfully");
      console.log(res);
      fetchTips();
    } catch (error) {
      console.error("Error deleting tip:", error);
      setError("Failed to delete pregnancy tip");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-10">
        <Oval
          height={80}
          width={80}
          color="#fda4af"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#fecdd3"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Pregnancy Tips Section */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Pregnancy Tips</h2>
            <p className="text-sm text-gray-500">
              Helpful advice for a healthy and happy pregnancy
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/tips-articles/add-pregnancytips");
              }}
              className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.pregnancyTips.map((tip) => (
            <div
              key={tip._id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-rose-100 p-2 rounded-full">
                  <Info className="w-4 h-4 text-rose-300" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-medium text-gray-800 mb-1">
                      {tip.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteTips(tip._id)}
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {tip.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trimester Checklist */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Trimester Checklist</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/tips-articles/add-trimeseter");
                }}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(data?.trimesters || {}).map(
              ([trimester, items]) => (
                <div
                  key={trimester}
                  className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                >
                  <p
                    className={`font-medium mb-2 ${
                      trimester === "1"
                        ? "text-rose-300"
                        : trimester === "2"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {trimester === "1"
                      ? "First"
                      : trimester === "2"
                      ? "Second"
                      : "Third"}{" "}
                    Trimester
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="bg-gray-50 p-3 rounded-lg flex justify-between items-start"
                      >
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
                </div>
              )
            )}
          </div>
        </div>

        {/* Recommended Foods */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Recommended Foods</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/tips-articles/add-recommended-food");
                }}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.recommendedFoods.map((food) => (
              <div
                key={food._id}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1 relative">
                  <img
                    src={food.imgUrl}
                    alt={food.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Food+Image";
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
                  <p className="text-sm font-medium text-gray-800">
                    {food.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Milestones */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Weekly Milestones</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/tips-articles/add-milestone");
                }}
                className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            {data?.milestones
              .sort((a, b) => a.week - b.week)
              .map((milestone) => (
                <div
                  key={milestone._id}
                  className="flex justify-between items-center"
                >
                  <p>
                    <span className="font-medium text-rose-300">
                      Week {milestone.week}:
                    </span>{" "}
                    {milestone.content}
                  </p>
                  <button
                    onClick={() => handleDeleteMilestone(milestone._id)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 ml-2"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsArticles;
