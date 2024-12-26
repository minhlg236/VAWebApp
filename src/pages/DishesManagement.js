import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin, message } from "antd";
import MainLayout from "../components/MainLayout";
import SearchBar from "../components/SearchBar";
import DishTable from "../components/DishTable";
import axios from "axios";

const DishesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/dishs/alldish",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDishes(response.data);
        setFilteredDishes(response.data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/");
        } else {
          message.error("Đã xảy ra lỗi khi tải danh sách món ăn.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, [navigate]);

  useEffect(() => {
    const filtered = dishes.filter(
      (dish) =>
        dish.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.dishType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.preferenceName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDishes(filtered);
  }, [searchTerm, dishes]);

  const fetchDishDetails = async (dishId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/dishs/GetDishByID/${dishId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching dish details:", error);
      message.error("Không thể tải thông tin món ăn.");
      return null;
    }
  };

  const handleStatusChangeClick = async (dish) => {
    try {
      const token = localStorage.getItem("authToken");
      const newStatus = dish.status === "active" ? "inactive" : "active";

      const dishDetails = await fetchDishDetails(dish.dishId);

      if (!dishDetails) {
        return; // Exit if fetching details failed
      }

      const updatedDish = {
        ...dishDetails,
        status: newStatus,
      };

      const endpoint = `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/dishs/updateDishDetailByDishId`;

      // Thực hiện yêu cầu PUT
      await axios.put(endpoint, updatedDish, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Cập nhật trạng thái món ăn trong danh sách
      setDishes((prevDishes) =>
        prevDishes.map((d) =>
          d.dishId === dish.dishId ? { ...d, status: newStatus } : d
        )
      );
      message.success(`Món ăn đã được chuyển sang trạng thái ${newStatus}.`);
    } catch (error) {
      console.error("Error changing dish status:", error);
      message.error("Không thể thay đổi trạng thái món ăn. Vui lòng thử lại.");
    }
  };

  return (
    <MainLayout title="Quản lý món ăn">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button type="primary" onClick={() => navigate("/create-dish")}>
          Tạo món ăn mới
        </Button>
      </div>
      {isLoading ? (
        <Spin tip="Đang tải danh sách món ăn..." />
      ) : filteredDishes.length === 0 ? (
        <div>Không có món ăn nào để hiển thị.</div>
      ) : (
        <DishTable
          dishes={filteredDishes}
          handleStatusChangeClick={handleStatusChangeClick}
        />
      )}
    </MainLayout>
  );
};

export default DishesManagement;
