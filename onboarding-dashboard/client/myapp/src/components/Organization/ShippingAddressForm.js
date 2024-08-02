import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ShippingAddressForm = ({
  onAddShipping,
  onUpdateShipping,
  shippingAddresses,
  orgId,
}) => {
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    pin: "",
    city: "",
    state: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    addressLine1: false,
    addressLine2: false,
    pin: false,
    city: false,
    state: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [addressId, setAddressId] = useState(null);

  const STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  useEffect(() => {
    if (modalOpen && !editMode) {
      clearForm();
    }
  }, [modalOpen, editMode]);

  const clearForm = () => {
    setShippingAddress({
      addressLine1: "",
      addressLine2: "",
      pin: "",
      city: "",
      state: "",
    });
    setErrors({
      addressLine1: false,
      addressLine2: false,
      pin: false,
      city: false,
      state: false,
    });
    setEditMode(false);
    setEditIndex(null);
    setAddressId(null);
  };

  const handleAddShippingAddress = () => {
    setModalOpen(true);
    setEditMode(false);
    setAddressId(null);
  };

  const handleEditAddress = (index) => {
    const addressToEdit = shippingAddresses[index];
    const [line1, line2] = addressToEdit.location.split(", ");
    setShippingAddress({
      addressLine1: line1,
      addressLine2: line2,
      pin: String(addressToEdit.pin),
      city: addressToEdit.city,
      state: addressToEdit.state,
    });

    setEditIndex(index);
    setEditMode(true);
    setAddressId(addressToEdit._id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    clearForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      addressLine1: !shippingAddress.addressLine1.trim(),
      addressLine2: !shippingAddress.addressLine2.trim(),
      pin: !shippingAddress.pin.trim(),
      city: !shippingAddress.city.trim(),
      state: !shippingAddress.state.trim(),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const newAddress = {
      location: `${shippingAddress.addressLine1.trim()}, ${shippingAddress.addressLine2.trim()}`,
      pin: shippingAddress.pin.trim(),
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
    };

    const token = localStorage.getItem("authToken");

    try {
      let updatedShippingAddresses;
      if (editMode && orgId) {
        // Existing organization, edit mode
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}/shipping/${addressId}`,
          newAddress,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        console.log(
          "Address updated successfully",
          response.data.updatedAddress
        );

        // Fetch updated data
        const orgResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        updatedShippingAddresses = orgResponse.data.shipping;
      } else if (orgId) {
        // Existing organization, add new address
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}/shipping`,
          newAddress,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        console.log("Address added successfully", response.data.addedAddress);

        // Fetch updated data
        const orgResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        updatedShippingAddresses = orgResponse.data.shipping;
      } else {
        // New organization, update address locally
        if (editMode) {
          updatedShippingAddresses = shippingAddresses.map((address, index) =>
            index === editIndex ? newAddress : address
          );
        } else {
          updatedShippingAddresses = [...shippingAddresses, newAddress];
        }
      }

      onUpdateShipping(updatedShippingAddresses);
      closeModal();
    } catch (error) {
      console.error("Error updating/adding address:", error);
      alert("Failed to update/add address. Please try again later.");
    }
  };

  const handleDeleteAddress = async (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!isConfirmed) {
      return; // If user cancels, do nothing
    }
    try {
      const addressToDelete = shippingAddresses[index];
      if (addressToDelete._id) {
        const token = localStorage.getItem("authToken");
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}/shipping/${addressToDelete._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
        console.log("Address deleted successfully");
      }
      // Update local state regardless of whether the address was in the backend or not
      const updatedAddresses = shippingAddresses.filter((_, i) => i !== index);
      onUpdateShipping(updatedAddresses);
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again later.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Shipping Addresses</h3>
      <div className="sm:flex flex-wrap">
        {shippingAddresses.map((address, index) => (
          <div
            key={index}
            className="mr-4 w-64 h-48 rounded overflow-hidden shadow-lg border-2 border-primary mb-6 flex flex-col"
          >
            <div className="px-6 py-4 flex-grow flex flex-col">
              <div className="font-bold text-xl mb-2">Shipping Address</div>
              <p
                className="text-gray-700 text-base overflow-hidden flex-grow"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {address && address.location ? (
                  <>
                    {address.location}, {address.city}, {address.state} -{" "}
                    {address.pin}
                  </>
                ) : (
                  "Invalid address"
                )}
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
        ))}
      </div>
      <div className="relative">
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 backdrop-blur-md">
            <Popup
              open={modalOpen}
              modal
              nested
              closeOnDocumentClick={false}
              contentStyle={{
                border: "3px solid #A14996",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                maxWidth: "500px",
                width: "100%",
              }}
            >
              {(close) => (
                <>
                  <h2 className="text-lg font-bold mb-4">
                    {editMode
                      ? "Edit Shipping Address"
                      : "Add Shipping Address"}
                  </h2>
                  <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="text-red-700">*</span>Address Line 1:
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={shippingAddress.addressLine1}
                        onChange={handleInputChange}
                        placeholder="Enter address line 1"
                        className={`border p-2 w-full rounded ${
                          errors.addressLine1
                            ? "border-red-500"
                            : "hover:border-primary focus:border-primary outline-primary"
                        }`}
                      />
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-xs mt-1">
                          Address Line 1 is required
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="text-red-700">*</span>Address Line 2:
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={shippingAddress.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Enter address line 2"
                        className="border p-2 w-full rounded hover:border-primary focus:border-primary outline-primary"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="text-red-700">*</span>Pin:
                      </label>
                      <input
                        type="text"
                        name="pin"
                        value={shippingAddress.pin}
                        onChange={handleInputChange}
                        placeholder="Enter pin"
                        className={`border p-2 w-full rounded ${
                          errors.pin
                            ? "border-red-500"
                            : "hover:border-primary focus:border-primary outline-primary"
                        }`}
                      />
                      {errors.pin && (
                        <p className="text-red-500 text-xs mt-1">
                          Pin is required
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="text-red-700">*</span>City:
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        className={`border p-2 w-full rounded ${
                          errors.city
                            ? "border-red-500"
                            : "hover:border-primary focus:border-primary outline-primary"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          City is required
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="state"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        State
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select State</option>
                        {STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          State is required
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        className="mr-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        {editMode ? "Update Address" : "Add Address"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </Popup>
          </div>
        )}
        <button
          onClick={handleAddShippingAddress}
          className=" bg-white text-primary  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          + Add Shipping Address
        </button>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
