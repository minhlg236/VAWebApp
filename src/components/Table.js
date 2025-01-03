import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, message, Tag, Avatar } from "antd"; // Added Avatar
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnhancedTable = ({ rows, onUserUpdated }) => {
  const navigate = useNavigate();

  const handleDelete = async (record) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/updateStaff`,
        {
          userId: record.userId,
          username: record.username,
          password: record.password, // **Lưu ý về bảo mật**
          email: record.email,
          phoneNumber: record.phoneNumber,
          status: "inactive",
          roleId: record.roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Người dùng đã bị khóa.");
      onUserUpdated(); // Gọi hàm callback để cập nhật lại danh sách
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Không thể cập nhật trạng thái người dùng.");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId - b.userId, // Added sorting
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Avatar",
      dataIndex: "imageUrl", // Assuming you might have an imageUrl
      key: "imageUrl",
      render: (imageUrl) => (
        <Avatar
          shape="circle" // Changed to circle for users
          size={48}
          src={imageUrl}
          alt="User"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      render: (roleId) => {
        const roles = {
          1: "Admin",
          2: "Nhân viên",
          3: "Khách hàng",
          4: "Kiểm duyệt viên",
          5: "Chuyên gia dinh dưỡng",
        };
        return roles[roleId] || "Không xác định";
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "red";
        let text = "Bị cấm";
        if (status === "active") {
          color = "green";
          text = "Hoạt động";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/userDetail/${record.userId}`)}
          >
            Xem chi tiết
          </Button>

          <Popconfirm
            title="Bạn có chắc chắn muốn khóa người dùng này không?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Khóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rows}
      rowKey="userId"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default EnhancedTable;
