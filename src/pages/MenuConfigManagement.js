// menuconfigmanagement.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import MainLayout from "../components/MainLayout";
import MenuConfigTable from "../components/MenuConfigTable";
import axios from "axios";

const MenuConfigManagement = () => {
  const navigate = useNavigate();
  const [menuConfigs, setMenuConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuConfigs = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const roleId = localStorage.getItem("roleId");

        if (!token || roleId !== "5") {
          message.error("Bạn không có quyền truy cập trang này!");
          navigate("/");
          return;
        }

        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/menuconfigs/allMenuConfig",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMenuConfigs(response.data);
      } catch (error) {
        console.error("Error fetching menu configurations:", error);
        message.error("Failed to load menu configurations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuConfigs();
  }, [navigate]);

  return (
    <MainLayout title="Quản lý dinh dưỡng menu">
      {isLoading ? (
        <Spin tip="Đang tải danh sách dinh dưỡng menu..." />
      ) : menuConfigs.length === 0 ? (
        <div>Không có thông tin dinh dưỡng menu nào để hiển thị.</div>
      ) : (
        <MenuConfigTable rows={menuConfigs} setMenuConfigs={setMenuConfigs} />
      )}
    </MainLayout>
  );
};

export default MenuConfigManagement;
