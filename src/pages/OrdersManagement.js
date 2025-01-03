import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Tabs, message } from "antd";
import MainLayout from "../components/MainLayout";
import SearchBar from "../components/SearchBar";
import OrderTable from "../components/OrderTable";
import axios from "axios";

const { TabPane } = Tabs;

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Hàm gửi thông báo
  const sendNotification = async (userId, notificationType, content) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Không tìm thấy token xác thực.");
        return;
      }

      const response = await axios.post(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/notifications/sendNotification`,
        {},
        {
          params: {
            userId,
            notificationType,
            content,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Gửi thông báo thành công.");
      } else {
        console.error("Gửi thông báo thất bại:", response);
      }
    } catch (error) {
      console.error("Lỗi khi gửi thông báo:", error);
    }
  };

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const roleId = localStorage.getItem("roleId");

        if (!token || roleId !== "2") {
          message.error("Bạn không có quyền truy cập trang này!");
          navigate("/");
          return;
        }

        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/allOrder",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        message.error("Không thể tải danh sách đơn hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Lọc đơn hàng theo trạng thái và từ khóa tìm kiếm
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "completed" && order.status === "delivered") ||
        (activeTab === "cancel" && order.status === "cancel") ||
        (activeTab === "failed" && order.status === "failed") ||
        (activeTab === "pending" &&
          ["pending", "processing", "delivering"].includes(order.status));

      const matchesSearchTerm =
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearchTerm;
    });

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm]);

  // Thay đổi tab trạng thái
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Điều hướng đến chi tiết đơn hàng
  const handleRowClick = (order) => {
    navigate(`/order-detail/${order.orderId}`, { state: { order } });
  };

  return (
    <MainLayout title="Quản lý đơn hàng">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Đã hoàn thành" key="completed" />
        <TabPane tab="Chưa hoàn thành" key="pending" />
        <TabPane tab="Đã hủy" key="cancel" />
        <TabPane tab="Giao thất bại" key="failed" />
      </Tabs>
      {isLoading ? (
        <Spin tip="Đang tải danh sách đơn hàng..." />
      ) : filteredOrders.length === 0 ? (
        <div>Không có đơn hàng nào để hiển thị.</div>
      ) : (
        <OrderTable
          rows={filteredOrders}
          handleRowClick={handleRowClick}
          setOrders={setOrders}
          sendNotification={sendNotification}
        />
      )}
    </MainLayout>
  );
};

export default OrdersManagement;
