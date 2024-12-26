import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import MainLayout from "../components/MainLayout"; // Sử dụng MainLayout
import SearchBar from "../components/SearchBar";
import NutritionCriteriaTable from "../components/NutritionCriteriaTable";
import axios from "axios";

const NutritionCriteriaManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [nutritionCriteria, setNutritionCriteria] = useState([]);
  const [filteredCriteria, setFilteredCriteria] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchNutritionCriteria = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/nutritionCriterions/allNutritionCriteria",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNutritionCriteria(response.data);
        setFilteredCriteria(response.data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching nutrition criteria:", error);
        if (error.response && error.response.status === 401) {
          message.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại!");
          navigate("/");
        } else {
          message.error("Không thể tải dữ liệu tiêu chí dinh dưỡng.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutritionCriteria();
  }, [navigate]);

  // Filter criteria based on search term
  useEffect(() => {
    const filtered = nutritionCriteria.filter(
      (criteria) =>
        criteria.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        criteria.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        criteria.goal.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCriteria(filtered);
  }, [searchTerm, nutritionCriteria]);

  return (
    <MainLayout title="Quản lý tiêu chí dinh dưỡng">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button
          type="primary"
          onClick={() => navigate("/create-nutritionCriteria")}
        >
          Tạo tiêu chí mới
        </Button>
      </div>
      {isLoading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : filteredCriteria.length === 0 ? (
        <div>Không có tiêu chí nào để hiển thị.</div>
      ) : (
        <NutritionCriteriaTable rows={filteredCriteria} />
      )}
    </MainLayout>
  );
};

export default NutritionCriteriaManagement;
