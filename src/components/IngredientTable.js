import React, { useState } from "react";
import { Table, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";

const IngredientTable = ({ rows }) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  const columns = [
    {
      title: "Ingredient ID",
      dataIndex: "ingredientId",
      key: "ingredientId",
      sorter: (a, b) => a.ingredientId - b.ingredientId,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trọng lượng (g)",
      dataIndex: "weight",
      key: "weight",
      sorter: (a, b) => a.weight - b.weight,
    },
    {
      title: "Calories",
      dataIndex: "calories",
      key: "calories",
      sorter: (a, b) => a.calories - b.calories,
    },
    {
      title: "Protein (g)",
      dataIndex: "protein",
      key: "protein",
      sorter: (a, b) => a.protein - b.protein,
    },
    {
      title: "Carbs (g)",
      dataIndex: "carbs",
      key: "carbs",
      sorter: (a, b) => a.carbs - b.carbs,
    },
    {
      title: "Fat (g)",
      dataIndex: "fat",
      key: "fat",
      sorter: (a, b) => a.fat - b.fat,
    },
    {
      title: "Sodium (mg)",
      dataIndex: "sodium",
      key: "sodium",
      sorter: (a, b) => a.sodium - b.sodium,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() =>
              navigate(`/ingredient-detail/${record.ingredientId}`)
            }
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rows}
      rowKey="ingredientId"
      pagination={pagination}
      onChange={(pagination) => setPagination(pagination)}
    />
  );
};

export default IngredientTable;
