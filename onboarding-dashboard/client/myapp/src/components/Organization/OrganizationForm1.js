import React, { useRef, useState } from 'react';
import axios from 'axios';
import { faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrganizationForm1 = ({ orgName, setOrgName, cin, setCin, pan, setPan, cinFileUrl, setCinFileUrl, panFileUrl, setPanFileUrl }) => {
  const [cinFile, setCinFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const cinFileInputRef = useRef(null);
  const panFileInputRef = useRef(null);

  const handleFileUpload = async (file, setFileUrl, fileType) => {
    if (!file) {
      console.log(`No ${fileType} file provided`);
      return;
    }
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/organizations/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "x-auth-token": token
        }
      });
  
      const { url } = response.data;
  
      setFileUrl(url);
      alert(`${fileType} file uploaded successfully`);
    } catch (err) {
      console.error(`${fileType} file upload error:`, err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        alert(`${fileType} file upload failed: ${err.response.data.message || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        alert(`${fileType} file upload failed: No response received from server`);
      } else {
        console.error('Error message:', err.message);
        alert(`${fileType} file upload failed: ${err.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCinUploadClick = () => {
    const cinRegex = /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
    if (!cinRegex.test(cin)) {
      alert("Invalid CIN format. Please enter a valid CIN.");
      return;
    }
    cinFileInputRef.current.click();
  };
  
  const handleCinFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCinFile(file);
      console.log("CIN file selected:", file.name);
      handleFileUpload(file, setCinFileUrl, 'CIN');
    }
    // Clear the input value to allow the same file to be selected again
    e.target.value = '';
  };

  const handleDownloadCinFile = async () => {
    if (!cinFileUrl) {
      alert("No CIN file available to download.");
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await axios.get(cinFileUrl, {
        headers: {
          'x-auth-token': token
        },
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'cin_file.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading CIN file:', err);
      alert('Failed to download CIN file. Please try again later.');
    }
  };

  const handlePanUploadClick = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
      alert("Invalid PAN format. Please enter a valid 10-digit alphanumeric PAN.");
      return;
    }
    panFileInputRef.current.click();
  };

  const handlePanFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPanFile(file);
      console.log("PAN file selected:", file.name);
      handleFileUpload(file, setPanFileUrl, 'PAN');
    }
    // Clear the input value to allow the same file to be selected again
    e.target.value = '';
  };

  const handleDownloadPanFile = async () => {
    if (!panFileUrl) {
      alert("No PAN file available to download.");
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await axios.get(panFileUrl, {
        headers: {
          'x-auth-token': token
        },
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pan_file.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading PAN file:', err);
      alert('Failed to download PAN file. Please try again later.');
    }
  };

  const removeCinFile = () => {
    setCinFile(null);
    setCinFileUrl("");
    cinFileInputRef.current.value = '';
  };

  const removePanFile = () => {
    setPanFile(null);
    setPanFileUrl("");
    panFileInputRef.current.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Organization Details</h3>
      <label className="block mb-2">Organization Name</label>
      <input
        type="text"
        placeholder="Org Name"
        className="w-full sm:w-1/2 p-2 mb-4 border rounded"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
      />
      <label className="block mb-2">CIN</label>
      <div className="flex flex-wrap items-center mb-4">
        <input
          type="text"
          value={cin}
          onChange={(e) => setCin(e.target.value)}
          className="flex w-full sm:w-1/2 p-2  border rounded"
          placeholder="CIN"
        />
        <button
          className="bg-primary text-white px-2 py-2 rounded-r"
          onClick={handleCinUploadClick}
        >
          Select CIN File
        </button>
        <input
          type="file"
          ref={cinFileInputRef}
          style={{ display: "none" }}
          onChange={handleCinFileChange}
        />
        {cinFile && (
          <div className="w-full mt-2 sm:w-auto sm:mt-0 sm:ml-5">
            <strong>Selected CIN file:</strong> {cinFile.name}
            <FontAwesomeIcon className="ml-5 text-blue-500" icon={faDownload} onClick={handleDownloadCinFile} />
            <FontAwesomeIcon className="ml-5 text-red-500" icon={faXmark} onClick={removeCinFile} />
          </div>
        )}
      </div>

      <label className="block mb-2 mt-4">PAN</label>
      <div className="flex flex-wrap items-center mb-4">
        <input
          type="text"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          className="flex w-full sm:w-1/2 p-2 border rounded"
          placeholder="PAN"
        />
        <button
          className="bg-primary text-white px-2 py-2 rounded-r"
          onClick={handlePanUploadClick}
        >
          Select PAN File
        </button>
        <input
          type="file"
          ref={panFileInputRef}
          style={{ display: "none" }}
          onChange={handlePanFileChange}
        />
        {panFile && (
          <div className="w-full mt-2 sm:w-auto sm:mt-0 sm:ml-5">
            <strong>Selected PAN file:</strong> {panFile.name}
            <FontAwesomeIcon className="ml-5 text-blue-500" icon={faDownload} onClick={handleDownloadPanFile} />
            <FontAwesomeIcon className="ml-5 text-red-500" icon={faXmark} onClick={removePanFile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationForm1;
