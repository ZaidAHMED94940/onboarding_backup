import React, { useState, useMemo } from "react";
import { State, City } from "country-state-city";

const CityStateSelector = ({ shippingAddresses }) => {
  const [selectedCountry] = useState("IN");
  const [selectedState, setSelectedState] = useState("MH");
  const [selectedCity, setSelectedCity] = useState("T");

  const states = useMemo(
    () => (selectedCountry ? State.getStatesOfCountry(selectedCountry) : []),
    [selectedCountry]
  );
  const cities = useMemo(
    () =>
      selectedState
        ? City.getCitiesOfState(selectedCountry, selectedState)
        : [],
    [selectedCountry, selectedState]
  );

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md w-full sm:w-[30%] mb-6">
        <label className="block mb-2 text-lg font-semibold">State</label>
        <select
          value={selectedState}
          onChange={handleStateChange}
          className="w-full p-2 border rounded"
          disabled={!selectedCountry}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md w-full sm:w-[30%] mb-6">
        <label className="block mb-2 text-lg font-semibold">City</label>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="w-full p-2 border rounded"
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Shipping Address Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md w-full sm:w-[30%] mb-6">
        <label className="block mb-2 text-lg font-semibold">Shipping Address:</label>
        <select className="w-full p-2 border rounded">
          <option value="">Select Shipping Address</option>
          {shippingAddresses.map((address, index) => (
            <option key={index} value={JSON.stringify(address)}>
              {`${address.location}, ${address.city}, ${address.state}, ${address.pin}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CityStateSelector;
