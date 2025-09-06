import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-6 py-12">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition duration-300"
      >
        ← Back
      </button>

      <div className="max-w-4xl bg-white shadow-lg rounded-2xl mt-4 p-10 relative">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-orange-600 mb-6 text-center">
          About Us
        </h1>

        {/* Content */}
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          We built this app to make daily bus travel{" "}
          <span className="font-semibold text-orange-500">hassle-free</span>.  
          Passengers often struggle with loose change — sometimes ₹2, sometimes ₹3 — and end up worrying every ride.  
          Our solution? A simple way to pay digitally, pick your route, and travel with confidence.
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          With our app, you can easily:
        </p>

        {/* Features */}
        <ul className="space-y-3 text-gray-800">
          <li className="flex items-start">
            <span className="text-orange-500 text-xl mr-3">✔</span>
            Find your bus quickly and choose your destination.
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 text-xl mr-3">✔</span>
            Pay seamlessly without worrying about change.
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 text-xl mr-3">✔</span>
            Get a digital ticket — no paper, no regrets.
          </li>
        </ul>

        {/* Closing */}
        <p className="text-gray-700 text-lg leading-relaxed mt-8">
          Whether you’re a student, worker, or frequent traveler,  
          our mission is to make your everyday ride smoother, faster,  
          and completely <span className="font-semibold text-orange-500">stress-free</span>.
        </p>

        {/* Footer line */}
        <div className="mt-10 text-center">
          <span className="text-orange-600 font-semibold text-xl">
            Travel smart. Travel simple. Travel with us.
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;
