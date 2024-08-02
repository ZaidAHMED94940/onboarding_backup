import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Roles({ onSubmit }) {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddOrUpdateRole = () => {
    if (editIndex !== null) {
      const updatedRoles = [...roles];
      updatedRoles[editIndex] = formData;
      setRoles(updatedRoles);
      setEditIndex(null);
    } else {
      setRoles([...roles, formData]);
    }
    onSubmit({ 
      username: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: "superadmin"
    });
    setFormData({ name: "", phone: "", email: "", password: "" });
    setShowForm(false);
  };

  const handleEditRole = (index) => {
    setFormData(roles[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4">SuperAdmin</h2>
      
      {roles.map((role, index) => (
        <div key={index} className="bg-white border-2 border-primary p-6 rounded-lg shadow-md mb-6">
          <div className="mb-4"><strong>Name:</strong> {role.name}</div>
          <div className="mb-4"><strong>Phone:</strong> {role.phone}</div>
          <div className="mb-4"><strong>Email:</strong> {role.email}</div>
          <div className="flex justify-end space-x-2 text-blue-500">
            <button className="px-2 border-none" onClick={() => handleEditRole(index)}>
              <FontAwesomeIcon icon={faPencil} className="mr-1" />
              Edit
            </button>
            <button className="px-2 border-none text-red-500" onClick={() => handleDeleteRole(index)}>
              <FontAwesomeIcon icon={faTrash} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      ))}

      {showForm && (
        <div>
          <div className="sm:flex flex-wrap gap-4 mb-4">
            <div className="flex flex-col w-full sm:w-[49%] mb-4 sm:mb-0">
              <label className="text-lg font-semibold">Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-1 border rounded"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[49%]">
              <label className="text-lg font-semibold">Phone</label>
              <PhoneInput
                country={"in"}
                regions={"asia"}
                masks={{ in: ".........." }}
                inputStyle={{ width: "100%", marginTop: "1em" }}
                placeholder="Enter your Number"
                disableDropdown={true}
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
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
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-start mt-6">
            <button
              type="button"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddOrUpdateRole}
            >
              {editIndex !== null ? "Update Role" : "Add Role"}
            </button>
            <button
              type="button"
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                setShowForm(false);
                setEditIndex(null);
                setFormData({ name: "", phone: "", email: "", password: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <div>
          <button
            className="text-primary bg-transparent px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
          >
            + Add a New Role
          </button>
        </div>
      )}
    </div>
  );
}
