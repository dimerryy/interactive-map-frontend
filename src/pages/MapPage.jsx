// src/pages/MapPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WorldMap from "../components/WorldMap";

const MapPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // redirect to login if no token
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <WorldMap />
    </div>
  );
};

export default MapPage;