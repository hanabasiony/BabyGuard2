import React from "react";
import { Info, Heart, Leaf, Smile } from "lucide-react";

export default function PregnancyTips() {
    return (
        <div className="py-30">
            <div className="p-4  max-w-5xl mx-auto space-y-6 ">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Pregnancy Tips</h2>
          <p className="text-sm text-gray-500">Helpful advice for a healthy and happy pregnancy</p>
        </div>
        <div className="text-pink-500">
          <Info className="w-6 h-6" />
        </div>
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <h3 className="text-lg font-semibold">Stay Hydrated</h3>
          <p className="text-sm text-gray-600">Drinking enough water helps with digestion and reduces swelling.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <h3 className="text-lg font-semibold">Regular Checkups</h3>
          <p className="text-sm text-gray-600">Keep up with prenatal visits to monitor your and your baby’s health.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <h3 className="text-lg font-semibold">Nutritious Diet</h3>
          <p className="text-sm text-gray-600">Include a variety of fruits, vegetables, and lean proteins.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <h3 className="text-lg font-semibold">Get Rest</h3>
          <p className="text-sm text-gray-600">Adequate rest is essential to support your body and baby.</p>
        </div>
      </div>

      {/* Trimester Checklist */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h3 className="text-xl font-semibold">Trimester Checklist</h3>
        <div className="space-y-2">
          <div>
            <p className="font-medium text-pink-600">First Trimester</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Schedule your first prenatal visit</li>
              <li>Start taking prenatal vitamins with folic acid</li>
              <li>Avoid harmful substances like alcohol and smoking</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-yellow-600">Second Trimester</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Attend anatomy scan ultrasound</li>
              <li>Maintain a healthy diet and stay active</li>
              <li>Start researching birth plans</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-green-600">Third Trimester</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Pack your hospital bag</li>
              <li>Take childbirth and breastfeeding classes</li>
              <li>Discuss delivery options with your doctor</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommended Foods */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h3 className="text-xl font-semibold">Recommended Foods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[{ name: "Leafy Greens", emoji: "🦬" }, { name: "Whole Grains", emoji: "🍞" }, { name: "Lean Proteins", emoji: "🍗" }, { name: "Fruits", emoji: "🍓" }, { name: "Dairy", emoji: "🥛" }, { name: "Nuts & Seeds", emoji: "🥜" }, { name: "Legumes", emoji: "🦘" }, { name: "Water", emoji: "💧" }].map((food) => (
            <div key={food.name} className="bg-gray-50 p-3 rounded-lg shadow-sm text-sm">
              <div className="text-2xl">{food.emoji}</div>
              <p className="mt-1">{food.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Milestones */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h3 className="text-xl font-semibold">Weekly Milestones</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-medium text-purple-600">Week 8:</span> Baby’s heartbeat can be heard via ultrasound.</p>
          <p><span className="font-medium text-purple-600">Week 12:</span> Risk of miscarriage decreases significantly.</p>
          <p><span className="font-medium text-purple-600">Week 20:</span> Halfway mark — baby bump becomes more visible.</p>
          <p><span className="font-medium text-purple-600">Week 28:</span> Baby starts opening their eyes.</p>
          <p><span className="font-medium text-purple-600">Week 36:</span> Baby is almost full-term and begins moving into position.</p>
        </div>
      </div>
            </div>
        </div>
    );
}