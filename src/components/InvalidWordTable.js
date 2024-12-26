// ../components/InvalidWordTable.jsx

import React from "react";
import { Table, Button, Space } from "antd";

const InvalidWordTable = ({ invalidWords, onUpdate, onDelete }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => onUpdate(record)} // Gọi hàm onUpdate với toàn bộ record
          >
            Sửa
          </Button>
          <Button
            type="danger"
            size="small"
            onClick={() => onDelete(record.content)} // Gọi hàm onDelete với content của record
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={invalidWords}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default InvalidWordTable;
