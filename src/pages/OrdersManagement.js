// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/OrdersManagement.css";
// import SearchBar from "../components/SearchBar";
// import OrderTable from "../components/OrderTable";
// import axios from "axios";
// import Sidebar from "../components/Sidebar"; // Import Sidebar

// const OrdersManagement = () => {
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState("all");

//   // Function to send notification
//   const sendNotification = async (userId, notificationType, content) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         console.error("No authentication token found.");
//         return;
//       }

//       const response = await axios.post(
//         `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/notifications/sendNotification`,
//         {},
//         {
//           params: {
//             userId,
//             notificationType,
//             content,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         console.log("Notification sent successfully:", response.data);
//       } else {
//         console.error("Failed to send notification:", response);
//       }
//     } catch (error) {
//       console.error("Error sending notification:", error);
//     }
//   };

//   // Fetch orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const roleId = localStorage.getItem("roleId");

//         if (!token || roleId !== "2") {
//           alert("Bạn không có quyền truy cập trang này!");
//           navigate("/");
//           return;
//         }

//         const response = await axios.get(
//           "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/allOrder",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setOrders(response.data);
//         setFilteredOrders(response.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem("authToken");
//           navigate("/");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [navigate]);

//   // Filter orders by status and search term
//   useEffect(() => {
//     let filtered = orders;

//     if (filterStatus === "completed") {
//       filtered = orders.filter((order) => order.status === "delivered");
//     } else if (filterStatus === "cancelled") {
//       filtered = orders.filter((order) => order.status === "cancel");
//     } else if (filterStatus === "pending") {
//       filtered = orders.filter((order) =>
//         ["pending", "processing", "delivering"].includes(order.status)
//       );
//     }

//     filtered = filtered.filter(
//       (order) =>
//         order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     setFilteredOrders(filtered);
//   }, [filterStatus, searchTerm, orders]);

//   // Handle navigation to OrderDetail with state
//   const handleRowClick = (order) => {
//     console.log(order); // Kiểm tra dữ liệu order
//     navigate(`/order-detail/${order.orderId}`, { state: { order } });
//   };

//   // Handle delete order (dummy implementation for now)
//   const handleDeleteClick = async (orderId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.delete(
//         `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/${orderId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setOrders((prevOrders) =>
//         prevOrders.filter((order) => order.orderId !== orderId)
//       );

//       alert("Đơn hàng đã được xóa thành công.");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       alert("Không thể xóa đơn hàng. Vui lòng thử lại.");
//     }
//   };

//   return (
//     <div className="Orders-container">
//       <Sidebar />
//       <div className="content">
//         <div>
//           <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//           <div className="filter-buttons">
//             <button
//               className={filterStatus === "all" ? "active" : ""}
//               onClick={() => setFilterStatus("all")}
//             >
//               Tất cả
//             </button>
//             <button
//               className={filterStatus === "completed" ? "active" : ""}
//               onClick={() => setFilterStatus("completed")}
//             >
//               Đã hoàn thành
//             </button>
//             <button
//               className={filterStatus === "pending" ? "active" : ""}
//               onClick={() => setFilterStatus("pending")}
//             >
//               Chưa hoàn thành
//             </button>
//             <button
//               className={filterStatus === "cancelled" ? "active" : ""}
//               onClick={() => setFilterStatus("cancelled")}
//             >
//               Đã hủy
//             </button>
//           </div>
//         </div>
//         {isLoading ? (
//           <div className="loading">Đang tải dữ liệu...</div>
//         ) : filteredOrders.length === 0 ? (
//           <div className="no-data">Không có đơn hàng nào để hiển thị.</div>
//         ) : (
//           <OrderTable
//             rows={filteredOrders}
//             handleRowClick={handleRowClick}
//             handleDeleteClick={handleDeleteClick}
//             setOrders={setOrders}
//             sendNotification={sendNotification} // Pass sendNotification to OrderTable
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrdersManagement;

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
        (activeTab === "cancelled" && order.status === "cancel") ||
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

  // // Xóa đơn hàng
  // const handleDeleteClick = async (orderId) => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     await axios.delete(
  //       `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/${orderId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setOrders((prevOrders) =>
  //       prevOrders.filter((order) => order.orderId !== orderId)
  //     );

  //     message.success("Đơn hàng đã được xóa thành công.");
  //   } catch (error) {
  //     console.error("Lỗi khi xóa đơn hàng:", error);
  //     message.error("Không thể xóa đơn hàng. Vui lòng thử lại.");
  //   }
  // };

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
        <TabPane tab="Đã hủy" key="cancelled" />
      </Tabs>
      {isLoading ? (
        <Spin tip="Đang tải danh sách đơn hàng..." />
      ) : filteredOrders.length === 0 ? (
        <div>Không có đơn hàng nào để hiển thị.</div>
      ) : (
        <OrderTable
          rows={filteredOrders}
          handleRowClick={handleRowClick}
          // handleDeleteClick={handleDeleteClick}
          setOrders={setOrders}
          sendNotification={sendNotification}
        />
      )}
    </MainLayout>
  );
};

export default OrdersManagement;
