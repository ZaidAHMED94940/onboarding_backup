import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
  faFilter,
  faMagnifyingGlass,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomeBackend = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Updated to 5 items per page
  const navigate = useNavigate();
  const [totalOrganizations, setTotalOrganizations] = useState(0);

  const handleAddButtonClick = () => {
    navigate("/OrganizationPage");
  };

  const handleOrderCreation = () => {
    navigate("/orders");
  };

  const handleUser = () => {
    navigate("/Userpage");
  };

  const handleEdit = (org) => {
    navigate(`/OrganizationPage/${org._id}`, { state: { organizationData: org } });
  };

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
        setData(fetchedData);
        setTotalOrganizations(fetchedData.length);
        console.log("Fetched organization data:", fetchedData);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };
    fetchOrganizationData();
  }, [navigate]);

  useEffect(() => {
    const filtered = data.filter((org) =>
      org.orgnazation_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
    setTotalOrganizations(filtered.length);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, data]);

  const handleDelete = async (orgId) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/organizations/${orgId}`,
          {
            headers: {
              "x-auth-token": authToken,
            },
          }
        );

        if (response.status === 200) {
          setData((prevData) => prevData.filter((org) => org._id !== orgId));
          setFilteredData((prevFiltered) =>
            prevFiltered.filter((org) => org._id !== orgId)
          );
          setTotalOrganizations((prev) => prev - 1);
          alert(response.data.msg);
        }
      } catch (error) {
        console.error("Error deleting organization:", error);
        if (error.response) {
          if (error.response.status === 404) {
            alert("Organization not found.");
          } else if (error.response.status === 500) {
            alert("Server error. Please try again later.");
          } else {
            alert(
              error.response.data.msg ||
                "An error occurred while deleting the organization."
            );
          }
        } else {
          alert("An error occurred while deleting the organization.");
        }
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2 mb-4">
        <p className="text-lg font-semibold">All</p>
        <div className="flex items-center">
          <p className="text-primary mr-2 text-2xl">Total Organizations:</p>
          <p className="text-primary font-bold text-2xl">{totalOrganizations}</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mb-4 gap-4">
        <div className="sm:flex flex-wrap gap-3">
          <div className="flex items-center gap-2 border-2 border-secondary rounded-md px-5 py-2">
            <FontAwesomeIcon icon={faFilter} size="xl" color="#A14996" />
            <p className="text-xl">Filter</p>
          </div>
          <div className="flex items-center gap-2 border-2 border-secondary rounded-md px-5 py-2">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="xl"
              color="#A14996"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60 text-black outline-none"
              id="user-searchbox"
              placeholder="Search organization"
            />
          </div>
        </div>
        <div className="flex-wrap">
          <button
            className="bg-white px-4 py-2 rounded-md text-primary border-primary border-2 mr-2"
            onClick={handleAddButtonClick}
          >
            ADD ORGANIZATION
          </button>
          <button
            className="bg-white px-4 py-2 rounded-md text-primary border-primary border-2 mr-2"
            onClick={handleOrderCreation}
          >
            CREATE ORDER
          </button>
          <button
            className="bg-white px-4 py-2 rounded-md text-primary border-primary border-2 mr-2"
            onClick={handleUser}
          >
            CREATE USER
          </button>
          <button
            className="text-white px-4 py-2 rounded-md bg-primary"
            onClick={handleLogout}
          >
            <FontAwesomeIcon className="mr-1" icon={faRightFromBracket} />
            Logout
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse mb-6">
          <thead>
            <tr className="bg-secondary h-16">
              <th className="border border-gray-300 px-4 py-2">Organization</th>
              <th className="border border-gray-300 px-4 py-2">
                Total Location
              </th>
              <th className="border border-gray-300 px-4 py-2">Last Update</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-t border-gray-300 h-16">
                <td className="border border-gray-300 px-4 py-2">
                  <p className="font-bold text-md">{item.orgnazation_name}</p>
                  <p className="text-md">{item.gst[0]?.number || "N/A"}</p>
                  <p className="text-md">{item.pan?.number || "N/A"}</p>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <p className="font-bold text-lg">
                    {item.shipping?.length || 0}
                  </p>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <p className="font-bold">Created at: {item.date || "N/A"}</p>
                  <p>Last Order: N/A</p>
                </td>
                <td className="border border-gray-300 px-4 py-2 gap-4">
                  <div className="sm:flex flex-wrap justify-center gap-6">
                    <button
                      className="text-blue-500 flex items-center"
                      onClick={() => handleEdit(item)}
                    >
                      <FontAwesomeIcon className="mr-2" icon={faPencil} />
                      Edit
                    </button>
                    <button
                      className="text-red-600 flex items-center"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FontAwesomeIcon className="mr-2" icon={faTrash} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center space-x-2">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`py-1 px-3 rounded ${
              currentPage === index + 1
                ? "bg-primary text-white"
                : "bg-gray-300 hover:bg-gray-400 text-black"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-3 rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomeBackend;
