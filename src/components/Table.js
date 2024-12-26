import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnhancedTable = ({ rows }) => {
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/updateStaff`,
        { userId, status: "inactive" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Người dùng đã bị khóa.");
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Không thể cập nhật trạng thái người dùng.");
    }
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
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
      render: (status) => (status === "active" ? "Hoạt động" : "Bị cấm"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/user/${record.userId}`)}
          >
            Xem chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn khóa người dùng này không?"
            onConfirm={() => handleDelete(record.userId)}
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
