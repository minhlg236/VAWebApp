import React, { useState, useEffect } from "react";
import { Tabs, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout"; // Import layout tổng thể
import SearchBar from "../components/SearchBar";
import EnhancedTable from "../components/Table";

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Customer");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users
  const fetchUsersData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/alluser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let fetchedUsers = response.data;

      if (activeTab === "Customer") {
        fetchedUsers = fetchedUsers.filter(
          (user) => user.roleId === 3 && user.status === "active"
        );
      } else if (activeTab === "System") {
        fetchedUsers = fetchedUsers.filter(
          (user) => [2, 5, 4].includes(user.roleId) && user.status === "active"
        );
      } else if (activeTab === "Banned") {
        fetchedUsers = fetchedUsers.filter(
          (user) => user.status === "inactive"
        );
      }

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại!");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [activeTab, navigate]);

  // Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        (user.username?.toLowerCase() || "").includes(
          (searchTerm || "").toLowerCase()
        ) ||
        (user.phoneNumber?.toLowerCase() || "").includes(
          (searchTerm || "").toLowerCase()
        ) ||
        (user.email?.toLowerCase() || "").includes(
          (searchTerm || "").toLowerCase()
        )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <MainLayout title="Quản lý người dùng">
      <Tabs
        defaultActiveKey="Customer"
        onChange={handleTabChange}
        items={[
          { label: "Khách hàng", key: "Customer" },
          { label: "Hệ thống", key: "System" },
          { label: "Bị cấm", key: "Banned" },
        ]}
      />
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button type="primary" onClick={() => navigate("/create-account")}>
          Thêm người dùng
        </Button>
      </div>

      <EnhancedTable rows={filteredUsers} onUserUpdated={fetchUsersData} />
    </MainLayout>
  );
};

export default AdminPage;
