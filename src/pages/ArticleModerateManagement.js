import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import MainLayout from "../components/MainLayout";
import SearchBar from "../components/SearchBar";
import ModerateTable from "../components/MorderateTable";
import axios from "axios";

const ArticleModerateManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/");
          return;
        }
        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articles/allArticleByRoleId/3",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const pendingArticles = response.data.filter(
          (article) => article.status === "pending"
        );
        setArticles(pendingArticles);
        setFilteredArticles(pendingArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/");
        } else {
          message.error("Đã xảy ra lỗi khi tải danh sách bài viết.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [navigate]);

  useEffect(() => {
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchTerm, articles]);

  return (
    <MainLayout title="Quản lý bài viết chờ duyệt">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      {isLoading ? (
        <Spin tip="Đang tải danh sách bài viết..." />
      ) : filteredArticles.length === 0 ? (
        <div>Không có bài viết nào để hiển thị.</div>
      ) : (
        <ModerateTable rows={filteredArticles} />
      )}
    </MainLayout>
  );
};

export default ArticleModerateManagement;
