import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ShippingAddressFile({ selectedOrgId, onSelectAddress }) {
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  useEffect(() => {
    if (selectedOrgId) {
      console.log("Selected Org ID in ShippingAddressFile:", selectedOrgId);
      fetchShippingAddresses(selectedOrgId);
    } else {
      // Clear shipping addresses when selectedOrgId is null
      setShippingAddresses([]);
      setSelectedAddressIndex(null);
    }
  }, [selectedOrgId]);

  const fetchShippingAddresses = async (orgId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      const shippingData = response.data.shipping || [];
      console.log("Fetched Shipping Addresses:", shippingData);
      setShippingAddresses(shippingData);
    } catch (error) {
      console.error("Error fetching shipping addresses:", error);
    }
  };

  const handleEditAddress = (index) => {
    console.log("Edit address at index:", index);
  };

  const handleDeleteAddress = (index) => {
    console.log("Delete address at index:", index);
  };

  const handleCheckboxChange = (index) => {
    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(null);
      onSelectAddress(null);
    } else {
      setSelectedAddressIndex(index);
      onSelectAddress(shippingAddresses[index]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Shipping Addresses</h3>
      <div className="sm:flex flex-wrap">
        {shippingAddresses.length > 0 ? (
          shippingAddresses.map((address, index) => (
            <div
              key={address._id.$oid}
              className="mr-4 w-64 h-48 rounded overflow-hidden shadow-lg border-2 border-primary mb-6 flex flex-col"
            >
              <div className="px-6 py-4 flex-grow flex flex-col">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedAddressIndex === index}
                    onChange={() => handleCheckboxChange(index)}
                    className="mr-2"
                  />
                  <div className="font-bold text-xl mb-2">Shipping Address</div>
                </div>
                <p
                  className="text-gray-700 text-base overflow-hidden flex-grow"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {address.location}, {address.city}, {address.state} -{" "}
                  {address.pin}
                </p>
              </div>
              <div className="flex justify-start gap-4 px-6 py-3 mt-auto">
                <button
                  onClick={() => handleEditAddress(index)}
                  className="text-blue-700 hover:text-blue-900"
                >
                  <FontAwesomeIcon icon={faPencil} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <button className="bg-white text-primary py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add Shipping Address
          </button>
        )}
      </div>
    </div>
  );
}
