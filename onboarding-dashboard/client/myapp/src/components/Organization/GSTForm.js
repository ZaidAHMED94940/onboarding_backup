import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
const indianStates = [
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
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];
const GSTForm = ({
  gstDetails,
  number,
  setNumber,
  billingName,
  setBillingName,
  gstAddress,
  setGstAddress,
  handleAddGST,
  handleDeleteGST,
  handleEditGST,
  editIndex,
  isValidGST,
  setIsValidGST,
  errors,
  setErrors,
  validateGSTIN,
  handleAddOrUpdateGST,
  toggleDiv,
  showDiv,
  showContainer,
  CancelDiv,
}) => {
  const handleAddressChange = (field, value) => {
    setGstAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
    setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">GST Details</h3>
      {gstDetails.map((gstDetail, index) => (
        <div
          key={index}
          className="bg-white border-2 border-primary p-6 rounded-lg shadow-md mb-6"
        >
          <div className="mb-4">
            <strong>GSTIN:</strong> {gstDetail.number}
          </div>
          <div className="mb-4">
            <strong>Billing Name:</strong> {gstDetail.billingname}
          </div>
          <div className="mb-4">
            <strong>Billing Address:</strong>{" "}
            {`${gstDetail.address.location}, ${gstDetail.address.city}, ${gstDetail.address.state}, ${gstDetail.address.pin}`}
          </div>
          <div className="flex justify-end space-x-2 text-blue-500">
            <button
              className="px-2 border-none "
              onClick={() => handleEditGST(index)}
            >
              <FontAwesomeIcon icon={faPencil} className="mr-1" />
              Edit
            </button>
            <button
              className="px-2 border-none text-red-500"
              onClick={() => handleDeleteGST(index)}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}
      {showDiv && (
        <div>
          <div className="flex flex-col md:flex-row mb-4 gap-4 md:gap-20">
            <div className="flex-1">
              <label>GSTIN</label>
              <div className="flex flex-col mb-4 md:mb-0">
                <input
                  type="text"
                  value={number}
                  onChange={(e) => {
                    const newValue = e.target.value.toUpperCase();
                    setNumber(newValue);
                    setIsValidGST(validateGSTIN(newValue));
                    setErrors({ ...errors, number: "" });
                  }}
                  className={`p-2 border rounded w-full ${
                    (!isValidGST && number) || errors.number
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Enter the GSTIN number"
                />
                {((!isValidGST && number) || errors.number) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.number ||
                      "Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5)"}
                  </p>
                )}
              </div>
              <label>Billing Name</label>
              <div className="flex flex-col mb-4 md:mb-0">
                <input
                  type="text"
                  value={billingName}
                  onChange={(e) => {
                    setBillingName(e.target.value);
                    setErrors({ ...errors, billingName: "" });
                  }}
                  className={`p-2 border rounded w-full ${
                    errors.billingName ? "border-red-500" : ""
                  }`}
                  placeholder="Billing Name"
                />
                {errors.billingName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billingName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label>Location</label>
              <div className="flex flex-col mb-4 md:mb-0">
                <input
                  type="text"
                  value={gstAddress.location}
                  onChange={(e) =>
                    handleAddressChange("location", e.target.value)
                  }
                  className={`p-2 border rounded w-full ${
                    errors.location ? "border-red-500" : ""
                  }`}
                  placeholder="Location"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>
              <label>City</label>
              <div className="flex flex-col mb-4 md:mb-0">
                <input
                  type="text"
                  value={gstAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className={`p-2 border rounded w-full ${
                    errors.city ? "border-red-500" : ""
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <label>State</label>
              <div className="flex flex-col mb-4 md:mb-0">
                <select
                  value={gstAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className={`p-2 border rounded w-full ${
                    errors.state ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select a state</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
              <label>PIN</label>
              <div className="flex flex-col mb-4 md:mb-0">
                <input
                  type="text"
                  value={gstAddress.pin}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^\d{0,6}$/.test(input)) {
                      handleAddressChange("pin", input);
                    }
                  }}
                  className={`p-2 border rounded w-full ${
                    errors.pin ? "border-red-500" : ""
                  }`}
                  placeholder="PIN"
                  maxLength="6"
                />
                {errors.pin && (
                  <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            <button
              className="text-white border-2 bg-primary px-4 py-2 rounded mr-3"
              onClick={() =>
                handleAddOrUpdateGST({
                  number,
                  billingname: billingName,
                  address: {
                    ...gstAddress,
                    pin: parseInt(gstAddress.pin),
                  },
                })
              }
            >
              {editIndex !== null ? "Update GST" : "Save GST"}
            </button>
            <button
              className=" text-primary
         border-2 border-primary px-4 py-2 rounded"
              onClick={CancelDiv}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showContainer && (
        <div>
          <button
            className="text-primary bg-transparent px-4 py-2 rounded"
            onClick={toggleDiv}
          >
            {" "}
            + Add a New GST
          </button>
        </div>
      )}
    </div>
  );
};

export default GSTForm;
