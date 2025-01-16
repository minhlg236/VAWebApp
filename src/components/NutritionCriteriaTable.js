import React from "react";
import { Table, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const NutritionCriteriaTable = ({ rows }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      dataIndex: "criteriaId",
      key: "criteriaId",
      sorter: (a, b) => a.criteriaId - b.criteriaId,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Độ tuổi",
      dataIndex: "ageRange",
      key: "ageRange",
    },
    {
      title: "BMI",
      dataIndex: "bmiRange",
      key: "bmiRange",
    },
    // {
    //   title: "Nghề nghiệp",
    //   dataIndex: "profession",
    //   key: "profession",
    // },
    {
      title: "Mức độ hoạt động",
      dataIndex: "activityLevel",
      key: "activityLevel",
    },
    {
      title: "Mục tiêu",
      dataIndex: "goal",
      key: "goal",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() =>
              navigate(`/nutritionCriteria-detail/${record.criteriaId}`)
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
      rowKey="criteriaId"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default NutritionCriteriaTable;
