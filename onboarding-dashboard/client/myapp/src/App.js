import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios"; // Make sure to import axios
import OrderForm from "./components/orders/OrderForm";
import OrganizationPage from "./components/Organization/OrganizationPage";
import HomeBackend from "./components/home/HomeBackend";
import Login from "./components/login/login";
import Userpage from "./components/User/Userpage";

function App() {
  const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const authToken = localStorage.getItem('authToken');
      setIsAuthenticated(!!authToken);
      setLoading(false);

      // Set up axios interceptor
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 401) {
            alert("Your session has expired. Please login again.");
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            return Promise.reject(error);
          }
          return Promise.reject(error);
        }
      );

      // Clean up the interceptor when the component unmounts
      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Or any loading indicator
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/OrganizationPage"
            element={
              <ProtectedRoute>
                <OrganizationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/OrganizationPage/:orgId" element={<OrganizationPage />} />
          <Route
            path="/home-backend"
            element={
              <ProtectedRoute>
                <HomeBackend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Userpage"
            element={
              <ProtectedRoute>
                <Userpage />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for non-existing paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;