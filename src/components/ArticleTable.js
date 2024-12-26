import React from "react";
import { Table, Button, Space, Tag, Image } from "antd";
import { useNavigate } from "react-router-dom";

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
    },
    {
      title: "Tác giả",
      dataIndex: "authorName",
      key: "authorName",
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
            onClick={() => navigate(`/article-detail/${record.articleId}`)}
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
      rowKey="articleId"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default ArticleTable;
