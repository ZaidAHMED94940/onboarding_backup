import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrganizationInput({ selectedOrganization, setSelectedOrganization, setShippingAddresses }) {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
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
        setOrganizations(fetchedData);
        console.log("Fetched organization data:", fetchedData);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };
    fetchOrganizationData();
  }, []);

  const handleSelectChange = async (e) => {
    const selectedOrgId = e.target.value;
    setSelectedOrganization(selectedOrgId);

    if (selectedOrgId) {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${selectedOrgId}`,
          {
            headers: {
              "x-auth-token": authToken,
            },
          }
        );
        const selectedOrgData = response.data;
        setShippingAddresses(selectedOrgData.shipping || []);
        console.log("Selected Organization Data:", selectedOrgData);
      } catch (error) {
        console.error("Error fetching selected organization data:", error);
      }
    } else {
      setShippingAddresses([]);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="organization" className="text-2xl font-bold">
        Organization:
      </label>
      <select
        id="organization"
        value={selectedOrganization}
        onChange={handleSelectChange}
        className="mt-4 block sm:w-1/3 w-full p-2 border rounded"
      >
        <option value="">Select Organization</option>
        {organizations.map((organization) => (
          <option key={organization._id} value={organization._id}>
            {organization.orgnazation_name}
          </option>
        ))}
      </select>
    </div>
  );
}
