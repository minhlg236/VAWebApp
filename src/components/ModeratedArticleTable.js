import React, { useState } from "react";
import { Table, Button, Space, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";

const ModeratedArticleTable = ({ rows }) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
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
        let color = "default";
        let text = "Bị từ chối";
        if (status === "accepted") {
          color = "green";
          text = "Đã duyệt";
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
    <Table
      columns={columns}
      dataSource={rows}
      rowKey="articleId"
      pagination={{
        ...pagination,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger: true,
      }}
      onChange={handleTableChange}
    />
  );
};

export default ModeratedArticleTable;
