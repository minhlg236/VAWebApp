// articletable
import React from "react";
import { Table, Button, Space, Tag, Image, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

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

const ArticleTable = ({ rows, onArticleDelete }) => {
  const navigate = useNavigate();
  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [selectedArticleId, setSelectedArticleId] = React.useState(null);
  const [selectedArticleData, setSelectedArticleData] = React.useState(null); // Store article data

  const handleDelete = async (articleId) => {
    setSelectedArticleId(articleId);
    try {
      const response = await axios.get(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Article/${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data) {
        setSelectedArticleData(response.data); // Store fetched article data
        setConfirmModalVisible(true); // Then open modal
      } else {
        message.error(
          "Không thể lấy thông tin bài viết. Vui lòng thử lại sau."
        );
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
      message.error("Không thể lấy thông tin bài viết. Vui lòng thử lại sau.");
    }
  };

  const confirmDelete = async () => {
    try {
      if (!selectedArticleData) return message.error("Không có dữ liệu để xóa");

      await axios.delete(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articles/deleteArticleByUserId`,
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          data: {
            ...selectedArticleData,
            articleId: selectedArticleId,
          },
        }
      );

      message.success("Bài viết đã được xóa thành công.");
      setConfirmModalVisible(false);
      setSelectedArticleData(null);
      if (onArticleDelete) {
        onArticleDelete();
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      message.error("Không thể xóa bài viết. Vui lòng thử lại sau.");
      setConfirmModalVisible(false);
      setSelectedArticleData(null);
    }
  };

  const cancelDelete = () => {
    setConfirmModalVisible(false);
    setSelectedArticleId(null);
    setSelectedArticleData(null);
  };

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
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.articleId)}
          >
            Xóa
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <>
      <StyledTable
        columns={columns}
        dataSource={rows}
        rowKey="articleId"
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title="Xác nhận xóa"
        open={confirmModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này?</p>
      </Modal>
    </>
  );
};

export default ArticleTable;
