import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import MainLayout from "../components/MainLayout"; // Sử dụng MainLayout
import SearchBar from "../components/SearchBar";
import IngredientTable from "../components/IngredientTable";
import axios from "axios";

const IngredientManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API để lấy dữ liệu nguyên liệu
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/allIngredient",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIngredients(response.data);
        setFilteredIngredients(response.data); // Gán dữ liệu ban đầu
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        if (error.response && error.response.status === 401) {
          message.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại!");
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, [navigate]);

  // Lọc nguyên liệu theo từ khóa tìm kiếm
  useEffect(() => {
    const filtered = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIngredients(filtered);
  }, [searchTerm, ingredients]);

  return (
    <MainLayout title="Quản lý nguyên liệu">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button type="primary" onClick={() => navigate("/create-ingredient")}>
          Tạo nguyên liệu mới
        </Button>
      </div>
      {isLoading ? (
        <Spin tip="Đang tải danh sách nguyên liệu..." />
      ) : filteredIngredients.length === 0 ? (
        <div>Không có nguyên liệu nào để hiển thị.</div>
      ) : (
        <IngredientTable rows={filteredIngredients} />
      )}
    </MainLayout>
  );
};

export default IngredientManagement;
