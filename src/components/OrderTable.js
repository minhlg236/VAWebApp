import React, { useState } from "react";
import { Table, Button, Space, Select, message, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { parseISO, format } from "date-fns";

const { Option } = Select;

const OrderTable = ({
  rows,
  handleDeleteClick,
  setOrders,
  sendNotification,
}) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const navigate = useNavigate();

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleUpdateStatus = async (orderId, newStatus, userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("Token xác thực không tồn tại. Vui lòng đăng nhập lại.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/updateStatusOrderByOrderId/${orderId}?newStatus=${newStatus}`,
        {},
        { headers }
      );

      // Logic to call the createGhnOrder API when status is set to "delivering"
      if (newStatus === "delivering") {
        try {
          const ghnResponse = await axios.post(
            `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/createGhnOrder/${orderId}`,
            {},
            { headers }
          );
          console.log("createGhnOrder API response:", ghnResponse.data);
          message.success("Đã tạo đơn hàng GHN thành công.");
        } catch (error) {
          console.error("Error calling createGhnOrder API:", error);
          message.error("Lỗi khi tạo đơn hàng GHN.");
          // Optionally revert the status update if createGhnOrder fails
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId
                ? { ...order, status: "processing" }
                : order
            )
          );
          return; // Exit the function to prevent further actions based on the failed GHN order creation
        }
      }

      let content = "";
      switch (newStatus) {
        case "processing":
          content = "Đơn hàng của bạn đang được xử lý.";
          break;
        case "delivering":
          content = "Đơn hàng của bạn đang được giao.";
          break;
        case "delivered":
          content = "Đơn hàng của bạn đã được giao thành công.";
          break;
        case "cancel":
          content = "Đơn hàng của bạn đã bị hủy.";
          break;
        case "failed":
          content = "Đơn hàng của bạn giao không thành công.";
          break;
        default:
          content = "Trạng thái đơn hàng của bạn đã thay đổi.";
      }

      if (sendNotification && userId) {
        await sendNotification(userId, "order_status", content);
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      );

      message.success("Cập nhật trạng thái đơn hàng thành công.");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      message.error("Không thể cập nhật trạng thái đơn hàng.");
    }
  };

  const columns = [
    {
      title: "ID Đơn Hàng",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: "ID Người Dùng",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId - b.userId,
    },
    {
      title: "Tổng Giá (VNĐ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Ngày Đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: (a, b) =>
        parseISO(a.orderDate).getTime() - parseISO(b.orderDate).getTime(),
      render: (orderDate) => format(parseISO(orderDate), "yyyy-MM-dd HH:mm:ss"),
    },
    {
      title: "Địa Chỉ Giao Hàng",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      sorter: (a, b) => a.deliveryAddress.localeCompare(b.deliveryAddress),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color = "default";
        let text = "";

        if (status === "delivered") {
          color = "green";
          text = "Đã giao hàng";
        } else if (status === "cancel") {
          color = "red";
          text = "Đã hủy";
        } else if (status === "failed") {
          color = "orange";
          text = "Giao hàng thất bại";
        }
        const showDropdown = ["pending", "processing", "delivering"].includes(
          status
        );

        return (
          <Space>
            {!showDropdown && <Tag color={color}>{text}</Tag>}
            {showDropdown && (
              <Select
                value={status}
                onChange={(newStatus) =>
                  handleUpdateStatus(record.orderId, newStatus, record.userId)
                }
                style={{ width: 150 }}
              >
                <Option value="pending">Chờ xử lý</Option>
                <Option value="processing">Đang xử lý</Option>
                <Option value="delivering">Đang giao</Option>
              </Select>
            )}
          </Space>
        );
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/order-detail/${record.orderId}`)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rows}
      rowKey="orderId"
      pagination={{
        ...pagination,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
    />
  );
};

OrderTable.propTypes = {
  rows: PropTypes.array.isRequired,
  handleDeleteClick: PropTypes.func,
  setOrders: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default OrderTable;
