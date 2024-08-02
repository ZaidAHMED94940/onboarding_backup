import React, { useState, useEffect } from "react";
import OrganizationForm1 from "./OrganizationForm1";
import GSTForm from "./GSTForm";
import ShippingAddressForm from "./ShippingAddressForm";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Roles from "./Roles";

const OrganizationPage = () => {
  const [orgName, setOrgName] = useState("");
  const [cin, setCin] = useState("");
  const [pan, setPan] = useState("");
  const [cinFileUrl, setCinFileUrl] = useState("");
  const [panFileUrl, setPanFileUrl] = useState("");
  const [gstDetails, setGstDetails] = useState([]);
  const [number, setNumber] = useState("");
  const [billingName, setBillingName] = useState("");
  const [gstAddress, setGstAddress] = useState({
    location: "",
    city: "",
    state: "",
    pin: ""
  });
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const { orgId } = useParams();
  const location1 = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [showContainer, setshowContainer] = useState(true);
  const [isValidGST, setIsValidGST] = useState(true);
  const [errors, setErrors] = useState({
    number: "",
    billingName: "",
    location: "",
    city: "",
    state: "",
    pin: "",
  });
  const [superadmin, setSuperadmin] = useState(null);

  const navigate = useNavigate();

  const toggleDiv = () => {
    setShowDiv(!showDiv);
    setshowContainer(false);
  };

  const savediv = () => {
    setShowDiv(!showDiv);
  };

  const CancelDiv = () => {
    setNumber("");
    setBillingName("");
    setGstAddress({
      location: "",
      city: "",
      state: "",
      pin: ""
    });
    setshowContainer(true);
    setShowDiv(false);
  };

  const handleCancel = () => {
    navigate("/home-backend");
  };

  useEffect(() => {
    if (orgId && location1.state?.organizationData) {
      setIsEditMode(true);
      const orgData = location1.state.organizationData;
      setOrgName(orgData.orgnazation_name);
      setCin(orgData.cin.number);
      setPan(orgData.pan.number);
      setCinFileUrl(orgData.cin.url);
      setPanFileUrl(orgData.pan.url);
      setGstDetails(orgData.gst);
      setShippingAddresses(orgData.shipping);
    }
  }, [orgId, location1]);

  const handleSave = async () => {
    const data = {
      orgnazation_name: orgName,
      cin: {
        number: cin,
        url: cinFileUrl,
      },
      pan: {
        number: pan,
        url: panFileUrl,
      },
      gst: gstDetails,
      shipping: shippingAddresses,
      superadmin: superadmin,
    };

    try {
      const token = localStorage.getItem("authToken");
      let response;

      if (isEditMode) {
        response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );
      }

      console.log("Response from backend:", response.data);
      alert(
        isEditMode
          ? "Organization updated successfully!"
          : "Organization created successfully!"
      );
      navigate("/home-backend");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Please fill all data");
    }
  };

  const handleAddGST = async (newGSTDetail) => {
    if (
      !newGSTDetail.number ||
      !newGSTDetail.billingname ||
      !newGSTDetail.address.location ||
      !newGSTDetail.address.city ||
      !newGSTDetail.address.state ||
      !newGSTDetail.address.pin
    ) {
      alert("Please fill in all GST details before adding.");
      return;
    }
  
    if (!isEditMode) {
      setGstDetails([...gstDetails, newGSTDetail]);
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}/gst`,
        newGSTDetail,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
  
      console.log("GST add response:", response.data);
  
      // Make a GET request to fetch the updated organization data
      const getResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
  
      // Update the gstDetails state with the fresh data from the GET response
      setGstDetails(getResponse.data.gst);
  
      alert("GST entry added successfully!");
    } catch (error) {
      console.error("Error adding GST:", error);
      alert("Failed to add GST entry. Please try again later.");
    }
  };

  const handleEditGST = (index) => {
    const gstDetail = gstDetails[index];
    setNumber(gstDetail.number);
    setBillingName(gstDetail.billingname);
    setGstAddress({
      location: gstDetail.address.location,
      city: gstDetail.address.city,
      state: gstDetail.address.state,
      pin: gstDetail.address.pin
    });
    setEditIndex(index);
    setShowDiv(true);
    setshowContainer(false);
  };

  const handleDeleteGST = async (index) => {
    if (!isEditMode) {
      const updatedGSTDetails = [...gstDetails];
      updatedGSTDetails.splice(index, 1);
      setGstDetails(updatedGSTDetails);
    } else {
      const gstToDelete = gstDetails[index];
      if (!gstToDelete || !gstToDelete._id) {
        console.error("Invalid GST entry or missing ID");
        return;
      }
  
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}/gst/${gstToDelete._id}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
  
        if (response.status === 200) {
          const updatedGSTDetails = gstDetails.filter((_, i) => i !== index);
          setGstDetails(updatedGSTDetails);
          alert("GST entry deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting GST entry:", error);
        alert("Failed to delete GST entry. Please try again later.");
      }
    }
  
    if (editIndex !== null && editIndex === index) {
      setEditIndex(null);
      setNumber("");
      setBillingName("");
      setGstAddress({
        location: "",
        city: "",
        state: "",
        pin: ""
      });
    }
  };

  const validateGSTIN = (gstin) => {
    const gstinRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin);
  };

  const handleAddOrUpdateGST = () => {
    const newGSTDetail = {
      number:number,
      billingname: billingName,
      address: {
        ...gstAddress,
        pin: parseInt(gstAddress.pin)
      }
    };
  
    if (editIndex !== null) {
      if (isEditMode) {
        handleUpdateGST(editIndex, newGSTDetail);
      } else {
        const updatedGSTDetails = [...gstDetails];
        updatedGSTDetails[editIndex] = newGSTDetail;
        setGstDetails(updatedGSTDetails);
      }
    } else {
      handleAddGST(newGSTDetail);
    }
  
    // Reset form fields
    setNumber("");
    setBillingName("");
    setGstAddress({
      location: "",
      city: "",
      state: "",
      pin: ""
    });
    setShowDiv(false);
    setshowContainer(true);
    setEditIndex(null);
  };
  const handleUpdateGST = async (index, updatedGSTDetail) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}/gst/${gstDetails[index]._id}`,
        updatedGSTDetail,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      const response2 = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      console.log(response2);
      console.log(response2.data)
      console.log("GST update response:", response.data);
      const updatedGSTDetails = [...gstDetails];
      updatedGSTDetails[index] = response.data.organization.gst.find(g => g._id === gstDetails[index]._id);
      setGstDetails(updatedGSTDetails);
      setEditIndex(null);
      alert("GST entry updated successfully!");
    } catch (error) {
      console.error("Error updating GST:", error);
      alert("Failed to update GST entry. Please try again later.");
    }
  };

  const handleAddShipping = (newAddress) => {
    setShippingAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };

  const handleUpdateShipping = (updatedAddresses) => {
    setShippingAddresses(updatedAddresses);
  };

  useEffect(() => {
    if (editIndex !== null) {
      const gstDetail = gstDetails[editIndex];
      setNumber(gstDetail.number);
      setBillingName(gstDetail.billingname);
      setGstAddress({
        location: gstDetail.address.location,
        city: gstDetail.address.city,
        state: gstDetail.address.state,
        pin: gstDetail.address.pin
      });
    } else {
      setNumber("");
      setBillingName("");
      setGstAddress({
        location: "",
        city: "",
        state: "",
        pin: ""
      });
    }
    setErrors({
      number: "",
      billingName: "",
      location: "",
      city: "",
      state: "",
      pin: "",
    });
  }, [editIndex]);
  // Roles
  const handleRoleSubmit = (role) => {
    setSuperadmin(role);
  }
  return (
    <div className="p-6 bg-secondary">
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Organization" : "Create Organization"}
      </h2>
      <OrganizationForm1
        orgName={orgName}
        setOrgName={setOrgName}
        cin={cin}
        setCin={setCin}
        pan={pan}
        setPan={setPan}
        cinFileUrl={cinFileUrl}
        setCinFileUrl={setCinFileUrl}
        panFileUrl={panFileUrl}
        setPanFileUrl={setPanFileUrl}
      />
      <GSTForm
        gstDetails={gstDetails}
        number={number}
        setNumber={setNumber}
        billingName={billingName}
        setBillingName={setBillingName}
        gstAddress={gstAddress}
        setGstAddress={setGstAddress}
        handleAddGST={handleAddGST}
        handleDeleteGST={handleDeleteGST}
        handleEditGST={handleEditGST}
        editIndex={editIndex}
        isValidGST={isValidGST}
        setIsValidGST={setIsValidGST}
        errors={errors}
        setErrors={setErrors}
        validateGSTIN={validateGSTIN}
        handleAddOrUpdateGST={handleAddOrUpdateGST}
        toggleDiv={toggleDiv}
        showDiv={showDiv}
        showContainer={showContainer}
        CancelDiv={CancelDiv}
      />
      <ShippingAddressForm
        shippingAddresses={shippingAddresses}
        onAddShipping={handleAddShipping}
        onUpdateShipping={handleUpdateShipping}
        orgId={orgId}
      />
      <Roles onSubmit={handleRoleSubmit} />
      <button
        onClick={handleSave}
        className="ml-6 px-4 py-2 rounded text-white bg-primary"
      >
        Save and Update
      </button>
      <button
        className="ml-6 px-4 py-2 rounded border-2 border-primary text-primary bg-white"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default OrganizationPage;