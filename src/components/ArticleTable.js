import React from "react";
import { Table, Button, Space, Tag, Image } from "antd";
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

const ArticleTable = ({ rows }) => {
  const navigate = useNavigate();

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const extractImageFromContent = (content) => {
    if (!content) return null;
    const imageRegex = /<img.*?src=["'](.*?)["'].*?>/;
    const match = content.match(imageRegex);

    if (match && match[1]) {
      return {
        imageUrl: match[1],
        strippedContent: content.replace(imageRegex, ""),
      };
    }
    return { imageUrl: null, strippedContent: content };
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "articleId",
      key: "articleId",
      sorter: (a, b) => a.articleId - b.articleId,
      width: 50,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => {
        const strippedText = stripHtml(text);
        return (
          <div
            style={{
              maxWidth: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={strippedText}
          >
            {strippedText}
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Tác giả",
      dataIndex: "authorName",
      key: "authorName",
      width: 150,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      render: (text, record) => {
        const { strippedContent } = extractImageFromContent(text);
        const strippedText = stripHtml(strippedContent);
        return (
          <div
            style={{
              maxWidth: "300px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={strippedText}
          >
            {strippedText}
          </div>
        );
      },
      width: 300,
    },
    {
      title: "Hình ảnh",
      dataIndex: "content",
      key: "imageUrl",
      render: (text) => {
        const { imageUrl } = extractImageFromContent(text);
        return imageUrl ? (
          <Image
            src={imageUrl}
            alt="Article"
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
          />
        ) : (
          "Không có ảnh"
        );
      },
      width: 80,
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
      width: 100,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            onClick={() => navigate(`/article-detail/${record.articleId}`)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <StyledTable
      columns={columns}
      dataSource={rows}
      rowKey="articleId"
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
    />
  );
};

export default ArticleTable;
