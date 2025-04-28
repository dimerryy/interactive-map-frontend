// src/components/WorldMap.jsx
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import axios from "axios";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const API_BASE = "https://interactive-map-backend.onrender.com";

const WorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryStatus, setCountryStatus] = useState({}); // { "Kazakhstan": "visited", "Japan": "wishToVisit" }
  const [countryDescription, setCountryDescription] = useState(null);


  const token = localStorage.getItem("token");

  // 1. Fetch existing countries from backend on load
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_BASE}/countries`, {
          headers: { Authorization: `${token}` },
        });

        const statusMap = {};
        res.data.forEach((item) => {
          statusMap[item.CountryISO] = item.Status === "visited" ? "visited" : "wishToVisit";
        });

        setCountryStatus(statusMap);
      } catch (error) {
        console.error("Failed to fetch user countries:", error);
      }
    };

    if (token) fetchCountries();
  }, [token]);

  // 2. Handle click on a country
  const handleCountryClick = async (geo) => {
    const name = geo.properties.name;
    setSelectedCountry(name);
    setCountryDescription(null); // Clear previous description
  
    try {
      const res = await axios.post(
        `${API_BASE}/ai`,
        { countryName: name },
        { headers: { Authorization: `${token}` } }
      );
      setCountryDescription(res.data.description);
    } catch (error) {
      console.error("Failed to fetch AI description:", error);
      setCountryDescription("Sorry, could not load description.");
    }
  };
  // 3. Handle marking country
  const handleStatusChange = async (status) => {
    if (selectedCountry) {
      try {
        await axios.post(
          `${API_BASE}/countries`,
          {
            countryISO: selectedCountry,
            status: status === "visited" ? "visited" : "want",
          },
          {
            headers: { Authorization: `${token}` },
          }
        );

        setCountryStatus((prev) => ({
          ...prev,
          [selectedCountry]: status,
        }));
        setSelectedCountry(null);
      } catch (error) {
        console.error("Failed to update country:", error);
      }
    }
  };

  const handleClearMark = async () => {
    if (selectedCountry) {
      const updatedStatus = { ...countryStatus };
      delete updatedStatus[selectedCountry];
      setCountryStatus(updatedStatus);
  
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.delete(`${API_BASE}/countries/${selectedCountry}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
        } catch (error) {
          console.error("Failed to delete country:", error);
        }
      }
  
      setSelectedCountry(null);
    }
  };

  const handleReset = () => {
    setSelectedCountry(null);
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <div style={{ width: "70%" }}>
        <ComposableMap projectionConfig={{ scale: 150 }} width={980} height={500}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const status = countryStatus[countryName];

                let fillColor = "#D6D6DA"; // default gray
                if (status === "visited") {
                  fillColor = "#28a745"; // green
                } else if (status === "wishToVisit") {
                  fillColor = "#ffc107"; // yellow
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: { fill: fillColor, outline: "none" },
                      hover: { fill: "#F53", outline: "none" },
                      pressed: { fill: "#E42", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {selectedCountry && (
          <div style={{ marginTop: "10px" }}>
            <p>
              Mark <strong>{selectedCountry}</strong> as:
            </p>
            <button onClick={() => handleStatusChange("visited")}>Visited</button>
            <button onClick={() => handleStatusChange("wishToVisit")}>Wish to Visit</button>
            <button onClick={handleClearMark} style={{ marginLeft: "10px" }}>
              Clear Mark
            </button>
            <button onClick={handleReset} style={{ marginLeft: "10px" }}>
              Reset View
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          width: "30%",
          padding: "1rem",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Country Details</h2>
        {selectedCountry ? (
  <>
    <p><strong>Name:</strong> {selectedCountry}</p>
    <p><strong>Description:</strong> {countryDescription ? countryDescription : "Loading..."}</p>
  </>
) : (
  <p>Click a country to view details.</p>
)}
      </div>
    </div>
  );
};

export default WorldMap;