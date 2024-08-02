import React from "react";

export default function ACdetails({ onACDetailsChange }) {
  const handleChange = (e) => {
    const { id, value } = e.target;
    onACDetailsChange({ [id]: value });
  };

  return (
    <div className="bg-white shadow-md rounded-xl border-2 p-6 ">
      <h1 className="font-semibold text-lg mb-2">AC Details</h1>
      <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:space-x-40 space-y-4 lg:space-y-0 justify-center mb-6">
        <div className="w-full lg:w-auto">
          <label htmlFor="acType" className="mb-2 font-semibold mr-4 block lg:inline-block">
            AC type:
          </label>
          <select
            id="acType"
            className="border-2 border-gray-300 rounded py-2 px-4 w-full lg:w-auto"
            onChange={handleChange}
          >
            <option value="Split">Split</option>
            <option value="Cassette">Cassette</option>
          </select>
        </div>
        <div className="w-full lg:w-auto">
          <label htmlFor="tonnage" className="mb-2 font-semibold mr-4 block lg:inline-block">
            Tonnage:
          </label>
          <select
            id="tonnage"
            className="border-2 border-gray-300 rounded py-2 px-4 w-full lg:w-auto"
            onChange={handleChange}
          >
            <option value="1.0">1.0</option>
            <option value="1.5">1.5</option>
            <option value="2.0">2.0</option>
          </select>
        </div>
        <div className="w-full lg:w-auto">
          <label htmlFor="plan" className="mb-2 font-semibold mr-4 block lg:inline-block">
            Plan:
          </label>
          <select
            id="plan"
            className="border-2 rounded border-gray-300 py-2 px-4 w-full lg:w-auto"
            onChange={handleChange}
          >
            <option value="3year">3 Year</option>
            <option value="5years">5 Year</option>
          </select>
        </div>
      </div>
    </div>
  );
  
}  