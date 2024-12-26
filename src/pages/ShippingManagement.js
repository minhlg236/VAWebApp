import React, { useEffect, useState } from "react";
// import "../styles/ShippingManagement.css";
import SearchBar from "../components/SearchBar";
import ShippingTable from "../components/ShippingTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Import Sidebar

const ShippingManagement = () => {
  const [shippings, setShippings] = useState([]); // Shipping list from API
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [filteredShippings, setFilteredShippings] = useState([]); // Filtered shipping list
  const navigate = useNavigate();

  // Function to fetch shipping data
  const fetchShippings = async () => {
    try {
      const response = await axios.get(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/shipping/get-all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setShippings(response.data);
    } catch (error) {
      console.error("Error fetching shippings:", error);
      alert("Could not load shipping data.");
    }
  };

  useEffect(() => {
    fetchShippings();
  }, []);

  // Filter shippings based on the search term
  useEffect(() => {
    const filtered = shippings.filter((shipping) => {
      const matchesSearchTerm =
        shipping.customerFullname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        shipping.customerTel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipping.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(shipping.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(shipping.trackingId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(shipping.userId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        String(shipping.orderId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesSearchTerm;
    });
    setFilteredShippings(filtered);
  }, [shippings, searchTerm]);

  return (
    <div className="shipping-management-container">
      <Sidebar />
      <div className="content">
        <div className="shipping-header">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <ShippingTable
          rows={filteredShippings.map((shipping) => ({
            id: shipping.id,
            userId: shipping.userId,
            orderId: shipping.orderId,
            statusText: shipping.statusText,
            customerFullname: shipping.customerFullname,
            customerTel: shipping.customerTel,
            address: shipping.address,
            trackingId: shipping.trackingId,
          }))}
        />
      </div>
    </div>
  );
};

export default ShippingManagement;
