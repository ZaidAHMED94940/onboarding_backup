import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ACdetails from './ACdetails';
import OrgDetails from './OrgDetails';
import ShippingAddressFile from './ShippingAddressFile';

export default function OrderForm() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [selectedOrgData, setSelectedOrgData] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [acDetails, setAcDetails] = useState({
    acType: 'Split',
    tonnage: '1.0',
    plan: '3year'
  });
  const handleACDetailsChange = (newDetails) => {
    setAcDetails(prevDetails => ({ ...prevDetails, ...newDetails }));
  };

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  useEffect(() => {
    console.log("Selected Org ID updated:", selectedOrgId);
  }, [selectedOrgId]);

  const fetchOrganizationData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/organizations/`,
        {
          headers: {
            "x-auth-token": authToken,
          },
        }
      );
      const fetchedData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      console.log("Fetched organizations:", fetchedData);
      setOrganizations(fetchedData);
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  const handleOrgSelect = (orgId, orgData) => {
    console.log("Organization selected with ID:", orgId);
    setSelectedOrgId(orgId);
    setSelectedOrgData(orgData);
  };

  const handleClearSearch = () => {
    setSelectedOrgId(null);
    setSelectedOrgData(null);
    setSelectedShippingAddress(null);
  };

  const handleShippingAddressSelect = (address) => {
    setSelectedShippingAddress(address);
  };

  const handleSubmit = () => {
    if (!selectedOrgData) {
      alert("Please select an organization.");
      return;
    }

    const orderData = {
      organizationId: selectedOrgId,
      organizationName: selectedOrgData.orgnazation_name,
      billingName: selectedOrgData.billingName,
      gstNumber: selectedOrgData.number,
      billingAddress: selectedOrgData.billingAddress,
      shippingAddress: selectedShippingAddress,
      acDetails: acDetails
    };

    console.log("Order Data (JSON):");
    console.log(JSON.stringify(orderData, null, 2));

    alert("Order data has been logged to the console.");
  };


  return (
    <div className='space-y-6 p-6 bg-secondary min-h-screen justify-start block'>
      <h1 className="text-2xl font-bold">Order Details</h1>
      <ACdetails onACDetailsChange={handleACDetailsChange} />
      <OrgDetails
        organizations={organizations}
        onOrgSelect={handleOrgSelect}
        onClearSearch={handleClearSearch}
      />
      <ShippingAddressFile 
        selectedOrgId={selectedOrgId} 
        onSelectAddress={handleShippingAddressSelect}
      />
      <div className="space-x-4">
        <button 
          className='bg-primary text-white py-2 px-4 ml-4'
          onClick={handleSubmit}
        >
          Save
        </button>
        <button className='bg-white text-primary py-2 px-4'>
          Cancel
        </button>
      </div>
    </div>
  );
}