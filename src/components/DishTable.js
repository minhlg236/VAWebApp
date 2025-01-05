import React from "react";
import { Table, Button, Space, Avatar, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledTable = styled(Table)`
  .ant-table-cell {
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
`;

const DishTable = ({ dishes, handleStatusChangeClick }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      dataIndex: "dishId",
      key: "dishId",
      sorter: (a, b) => a.dishId - b.dishId,
      width: 60,
    },
    {
      title: "Tên món",
      dataIndex: "name",
      key: "name",
      width: 180,
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
      width: 80,
    },
    {
      title: "Loại món",
      dataIndex: "dishType",
      key: "dishType",
      width: 120,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} VNĐ`,
      sorter: (a, b) => a.price - b.price,
      width: 100,
    },
    {
      title: "Trường phái",
      dataIndex: "preferenceName",
      key: "preferenceName",
      width: 150,
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
      width: 100,
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
      width: 200,
    },
  ];

  return (
    <StyledTable
      columns={columns}
      dataSource={dishes}
      rowKey="dishId"
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
    />
  );
};

export default DishTable;
