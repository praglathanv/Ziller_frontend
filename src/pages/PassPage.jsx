import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TakePass = () => (
  <div className="p-6 text-lg text-gray-700">
    <h2 className="text-2xl font-bold text-center text-black mb-4">Take Pass</h2>
    <p>Here you can book a new bus pass for your travel.</p>
  </div>
);

const ViewPass = () => (
  <div className="p-6 text-lg text-gray-700">
    <h2 className="text-2xl font-bold text-center text-black mb-4">View Pass</h2>
    <p>Here you can view and manage your existing passes.</p>
  </div>
);

const PassPage = () => {
  const [activeTab, setActiveTab] = useState("take");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50 px-8 py-12">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition duration-300"
      >
        ← Back
      </button>

      {/* Tabs */}
      <div className="flex space-x-6 border-b-2 mt-4 border-gray-200 w-fit mb-6">
        <button
          className={`pb-2 text-lg font-medium ${
            activeTab === "take"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-orange-500"
          }`}
          onClick={() => setActiveTab("take")}
        >
          Take Pass
        </button>

        <button
          className={`pb-2 text-lg font-medium ${
            activeTab === "view"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-orange-500"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View Pass
        </button>
      </div>

      {/* Content */}
      <div className="flex justify-center">
        <div className="bg-white shadow-md rounded-xl w-full max-w-md">
          {activeTab === "take" ? <TakePass /> : <ViewPass />}
        </div>
      </div>

    </div>
  );
};

export default PassPage;
