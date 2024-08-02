import React, { useState, useEffect, useRef } from 'react';

export default function OrgDetails({ organizations, onOrgSelect, onClearSearch }) {
  const [searchOrg, setSearchOrg] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [gst, setGst] = useState({
    number: '',
    billingName: '',
    billingAddress: ''
  });
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showGstDropdown, setShowGstDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOrg) {
      const filtered = organizations.filter(org =>
        org.orgnazation_name.toLowerCase().includes(searchOrg.toLowerCase())
      );
      setFilteredOrgs(filtered);
      setShowOrgDropdown(true);
    } else {
      clearAllFields();
    }
  }, [searchOrg, organizations]);

  useEffect(() => {
    if (selectedOrg) {
      onOrgSelect(selectedOrg._id, {
        orgnazation_name: selectedOrg.orgnazation_name,
        ...gst
      });
    }
  }, [selectedOrg, gst]);

  const clearAllFields = () => {
    setSelectedOrg(null);
    setGst({
      number: '',
      billingName: '',
      billingAddress: ''
    });
    setFilteredOrgs([]);
    setShowOrgDropdown(false);
    setShowGstDropdown(false);
    onClearSearch();
  };

  const handleSearchOrgChange = (e) => {
    setSearchOrg(e.target.value);
    setShowOrgDropdown(true);
    if (!e.target.value) {
      clearAllFields();
    }
  };

  const handleOrgSelect = (org) => {
    setSearchOrg(org.orgnazation_name);
    setSelectedOrg(org);
    setShowOrgDropdown(false);
    setGst({
      number: '',
      billingName: '',
      billingAddress: ''
    });
  };

  const handleGstSelect = (selectedGst) => {
    setGst({
      number: selectedGst.number,
      billingName: selectedGst.billingname,
      billingAddress: `${selectedGst.address.location}, ${selectedGst.address.city}, ${selectedGst.address.state}, ${selectedGst.address.pin}`
    });
    setShowGstDropdown(false);
  };


  const handleSearchOrgFocus = () => {
    if (searchOrg) {
      setShowOrgDropdown(true);
    }
  };

  const handleSearchOrgBlur = () => {
    setTimeout(() => {
      setShowOrgDropdown(false);
    }, 200);
  };

  const handleGstNumberClick = () => {
    if (selectedOrg && selectedOrg.gst) {
      setShowGstDropdown(!showGstDropdown);
    }
  };

  const handleGstBlur = () => {
    setTimeout(() => {
      setShowGstDropdown(false);
    }, 200);
  };

  return (
    <div className="bg-white shadow-md rounded-xl border-2 p-6">
      <h1 className="font-semibold text-lg mb-4">Order Details</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-[45%] relative">
            <label htmlFor="searchOrg" className="mb-2 font-medium">Search Organization:</label>
            <input
              ref={inputRef}
              id="searchOrg"
              className="border-2 border-gray-400 p-2 rounded"
              placeholder="Search Organization"
              value={searchOrg}
              onChange={handleSearchOrgChange}
              onFocus={handleSearchOrgFocus}
              onBlur={handleSearchOrgBlur}
            />
            {showOrgDropdown && filteredOrgs.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto top-full left-0 shadow-md">
                {filteredOrgs.map((org) => (
                  <li
                    key={org._id.$oid}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => handleOrgSelect(org)}
                  >
                    {org.orgnazation_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col w-full sm:w-[45%] ml-auto">
            <label htmlFor="billingName" className="mb-2 font-medium">Billing Name:</label>
            <input
              id="billingName"
              className="border-2 border-gray-300 p-2 rounded"
              placeholder="Billing Name"
              value={gst.billingName}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-[45%] relative">
            <label htmlFor="gstNumber" className="mb-2 font-medium">GSTIN:</label>
            <div className="flex relative">
              <input
                id="gstNumber"
                className="flex-grow p-2 border rounded cursor-pointer"
                placeholder="Select GST number"
                value={gst.number}
                readOnly
                onClick={handleGstNumberClick}
                onBlur={handleGstBlur}
              />
              {showGstDropdown && selectedOrg && selectedOrg.gst && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto top-full left-0 shadow-md">
                  {selectedOrg.gst.map((gstItem) => (
                    <li
                      key={gstItem.number}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => handleGstSelect(gstItem)}
                    >
                      {gstItem.number}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full sm:w-[45%] ml-auto">
            <label htmlFor="billingAddress" className="mb-2 font-medium">Billing Address:</label>
            <input
              id="billingAddress"
              className="border-2 border-gray-300 p-2 rounded"
              placeholder="Billing Address"
              value={gst.billingAddress}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}