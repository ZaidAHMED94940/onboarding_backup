import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import CityStateSelector from "./CityStateSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import OrganizationInput from "./OrganizationInput";

const Userpage = () => {
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedOption, setSelectedOption] = useState("superadmin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(""); 
  const [shippingAddresses, setShippingAddresses] = useState([]); // State for shipping addresses
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(""); // State for selected shipping address
  const navigate = useNavigate();

  const handlePhoneChange = (value) => {
    setPhone(value);
    console.log("Phone number entered:", value);
  };

  const CancelPage = () => {
    navigate("/home-backend");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format. Please enter a valid email.");
      setEmail(""); // Reset email input field
    }
  };

  const handleSubmit = async () => {
    const newUser = {
      name: userName,
      email,
      password,
      phone,
      role: selectedOption,
      organization: selectedOrganization,
      shippingAddress: selectedShippingAddress, // Include selected shipping address
    };
  
    console.log("New User Data:", newUser);
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No authentication token found. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(newUser),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
  
      const data = await response.json();
      console.log("Response Data:", data);
      alert("User created successfully!");
      navigate("/login")
    } catch (error) {
      console.error("Error:", error);
      alert("There was a problem creating the user.");
    }
  };

  useEffect(() => {
    console.log("Selected Organization:", selectedOrganization);
  }, [selectedOrganization]);

  const handleShippingAddressChange = (e) => {
    setSelectedShippingAddress(e.target.value);
  };

  return (
    <div className="p-6 bg-secondary min-h-screen">
      <OrganizationInput 
        selectedOrganization={selectedOrganization}
        setSelectedOrganization={setSelectedOrganization}
        setShippingAddresses={setShippingAddresses}
      />
      <h2 className="text-2xl font-bold mb-6 mt-6">User Details</h2>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="sm:flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col w-full sm:w-[49%] mb-4 sm:mb-0">
            <label className="text-lg font-semibold">Name:</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-1 border rounded"
              value={userName}
              onChange={handleNameChange}
            />
          </div>
          <div className="w-full sm:w-[49%]">
            <label className="text-lg font-semibold">Phone</label>
            <PhoneInput
              country={"in"}
              value={phone}
              regions={"asia"}
              masks={{ in: ".........." }}
              onChange={handlePhoneChange}
              inputStyle={{ width: "100%", marginTop: "1em" }}
              placeholder="Enter your Number"
              disableDropdown={true}
            />
          </div>
        </div>

        <div className="sm:flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col w-full sm:w-[49%] mb-4 sm:mb-0">
            <label className="text-lg font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter the Email"
              className="w-full p-1 mb-4 border rounded"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
            />
          </div>
          <div className="w-full sm:w-[49%] relative">
            <label className="text-lg font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter the Password"
                className="w-full p-1 border rounded pr-10"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={toggleShowPassword}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-6 mb-6">User Roles</h2>

      <div className="sm:w-1/3 bg-white p-4 rounded-lg shadow-md w-full mb-6">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Role</option>
          <option value="superadmin">Superadmin</option>
          <option value="admin+">ADMIN +</option>
          <option value="admin">ADMIN</option>
          <option value="guest">GUEST</option>
        </select>
      </div>
      <CityStateSelector shippingAddresses={shippingAddresses} /> {/* Pass shipping addresses here */}
      
      <div className="bg-white ">
        <button
          className="text-white bg-primary px-4 py-2 rounded border-2 border-primary"
          onClick={handleSubmit}
        >
          Save
        </button>
        <button onClick={CancelPage} className="ml-4">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Userpage;
