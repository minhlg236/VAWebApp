import React, { useState } from "react";
import { Table, Button, Space, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";

const ModerateTable = ({ rows }) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5, // Số bài viết mặc định trên một trang
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "articleId",
      key: "articleId",
      sorter: (a, b) => a.articleId - b.articleId,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Tooltip title={title}>
          <span
            style={{
              display: "block",
              width: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "orange";
        let text = "Đang chờ duyệt";
        if (status === "accepted") {
          color = "green";
          text = "Đã duyệt";
        } else if (status === "unaccepted") {
          color = "red";
          text = "Bị từ chối";
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
            icon={<EyeOutlined />}
            onClick={() => navigate(`/article-detail/${record.articleId}`)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="articleId"
        pagination={{
          ...pagination,
          pageSizeOptions: [5, 10, 20], // Các tùy chọn số bài viết trên một trang
          showSizeChanger: true, // Hiển thị dropdown chọn số bài viết
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default ModerateTable;
