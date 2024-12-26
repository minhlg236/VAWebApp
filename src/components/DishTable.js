import React from "react";
import { Table, Button, Space, Avatar, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const DishTable = ({ dishes, handleStatusChangeClick }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      dataIndex: "dishId",
      key: "dishId",
      sorter: (a, b) => a.dishId - b.dishId,
    },
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Avatar
          shape="square"
          size={48}
          src={imageUrl}
          alt="Dish"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Loại món",
      dataIndex: "dishType",
      key: "dishType",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} VNĐ`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Trường phái",
      dataIndex: "preferenceName",
      key: "preferenceName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "red";
        let text = "Dừng bán";
        if (status === "active") {
          color = "green";
          text = "Đang bán";
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
            onClick={() => navigate(`/dish/${record.dishId}`)}
          >
            Xem chi tiết
          </Button>
          <Button type="link" onClick={() => handleStatusChangeClick(record)}>
            {record.status === "active" ? "Ngừng bán" : "Mở bán"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dishes}
      rowKey="dishId"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default DishTable;
