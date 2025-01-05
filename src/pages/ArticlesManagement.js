import React, { useEffect, useState } from "react";
import { Button, Spin, message, Col, Row } from "antd";
import MainLayout from "../components/MainLayout";
import SearchBar from "../components/SearchBar";
import ArticleTable from "../components/ArticleTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const ButtonStyled = styled(Button)`
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchArticleImages = async (articleId) => {
    try {
      const response = await axios.get(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articleImages/getArticleImageByArticleId/${articleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data.length > 0 ? response.data[0].imageUrl : null;
    } catch (error) {
      console.error(`Error fetching image for article ${articleId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articles/allArticleByRoleId/5",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const articlesWithImages = await Promise.all(
          response.data.map(async (article) => {
            const imageUrl = await fetchArticleImages(article.articleId);
            return { ...article, imageUrl };
          })
        );

        setArticles(articlesWithImages);
        setFilteredArticles(articlesWithImages);
      } catch (error) {
        console.error("Error fetching articles:", error);
        message.error("Không thể tải danh sách bài viết.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((article) => {
      const matchesSearchTerm =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearchTerm;
    });
    setFilteredArticles(filtered);
  }, [articles, searchTerm]);

  return (
    <MainLayout title="Quản lý bài viết">
      <Row
        style={{ marginBottom: "16px" }}
        align="middle"
        justify="space-between"
      >
        <Col span={24} md={12}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Col>
        <Col
          span={24}
          md={12}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <ButtonStyled
            type="primary"
            onClick={() => navigate("/create-article")}
          >
            Tạo bài viết mới
          </ButtonStyled>
        </Col>
      </Row>
      {isLoading ? (
        <Spin tip="Đang tải danh sách bài viết..." />
      ) : (
        <ArticleTable rows={filteredArticles} />
      )}
    </MainLayout>
  );
};

export default ArticlesManagement;
