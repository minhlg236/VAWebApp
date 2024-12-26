import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message, Tabs } from "antd";
import MainLayout from "../components/MainLayout";
import SearchBar from "../components/SearchBar";
import ModeratedArticleTable from "../components/ModeratedArticleTable";
import axios from "axios";
const { TabPane } = Tabs;
const ModeratedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("accepted");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articles/allArticleByRoleId/3",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setArticles(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bài viết:", error);
        message.error("Không thể tải danh sách bài viết.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((article) => {
      const isAccepted =
        activeTab === "accepted" && article.status === "accepted";
      const isRejected =
        activeTab === "rejected" && article.status === "rejected";
      const matchesSearchTerm =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      return (isAccepted || isRejected) && matchesSearchTerm;
    });
    setFilteredArticles(filtered);
  }, [articles, activeTab, searchTerm]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <MainLayout title="Quản lý bài viết đã duyệt">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <Tabs defaultActiveKey="accepted" onChange={handleTabChange}>
        <TabPane tab="Đã Duyệt" key="accepted" />
        <TabPane tab="Đã Từ Chối" key="rejected" />
      </Tabs>
      {isLoading ? (
        <Spin tip="Đang tải danh sách bài viết..." />
      ) : filteredArticles.length === 0 ? (
        <div>Không có bài viết nào để hiển thị.</div>
      ) : (
        <ModeratedArticleTable rows={filteredArticles} />
      )}
    </MainLayout>
  );
};

export default ModeratedArticles;
