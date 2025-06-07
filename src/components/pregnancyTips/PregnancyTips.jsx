import React, { useEffect, useState } from "react";

import { Info, Heart, Leaf, Smile } from "lucide-react";
import axios from "axios";

export default function PregnancyTips() {

   const [data , setData] = useState(null)

   const [milestones , setMilestones] = useState([])
   const [pregnancyTips , setPregnancyTips] = useState([])
   const [recommendedFoods , setRecommendedFoods] = useState([])
   const [trimesters , settrimesters] = useState([])



  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tips');
        setData(response.data.data);
        console.log(response.data.data);

        setMilestones('milestones',response.data.data.milestones);
        setPregnancyTips('PregnancyTips',response.data.data.PregnancyTips);
        setRecommendedFoods('recommendedFoods',response.data.data.recommendedFoods);
        settrimesters('trimesters',response.data.data.trimesters);

        

      } catch (err) {
        setError('Failed to fetch pregnancy tips');
        console.error('Error fetching tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);
  return (
    <div className="py-30">
      <div className="p-4 max-w-5xl mx-auto space-y-6">
        

        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Pregnancy Tips</h2>
            <p className="text-sm text-gray-500 pt-2">Helpful advice for a healthy and happy pregnancy</p>
          </div>

        </div>

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.pregnancyTips.map((tip) => (
            <div key={tip._id} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start space-x-3">
                <div className="bg-rose-100 p-2 rounded-full">
                  <Info className="w-4 h-4 text-rose-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-800 mb-1">{tip.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trimester Checklist */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h3 className="text-xl font-semibold">Trimester Checklist</h3>
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
                    <div key={item._id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Foods */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h3 className="text-xl font-semibold">Recommended Foods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data?.recommendedFoods.map((food) => (
              <div key={food._id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1">
                  <img 
                    src={food.imgUrl} 
                    alt={food.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Food+Image';
                    }}
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-medium text-gray-800">{food.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Milestones */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h3 className="text-xl font-semibold">Weekly Milestones</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {data?.milestones
              .sort((a, b) => a.week - b.week)
              .map((milestone) => (
                <p key={milestone._id}>
                  <span className="font-medium text-purple-600">Week {milestone.week}:</span> {milestone.content}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}