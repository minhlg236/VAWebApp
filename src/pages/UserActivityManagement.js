import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UserActivityManagement.css";

const mockUserData = {
  userId: "User 1",
  articles: [
    {
      articleId: 1,
      title: "Lợi ích của ăn chay đối với sức khỏe",
      status: "accepted",
    },
    {
      articleId: 2,
      title: "Các món ăn chay đơn giản dễ làm tại nhà",
      status: "pending",
    },
  ],
};

const UserActivityManagement = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUserData);
  const [isBanned, setIsBanned] = useState(false);

  const handleBanUser = () => {
    setIsBanned(true);
    alert("Người dùng đã bị cấm tham gia cộng đồng!");
  };

  return (
    <div className="user-activity-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Quay lại
      </button>
      <h2>Hoạt động của {user.userId}</h2>
      <div className="user-articles">
        <h3>Bài viết do {user.userId} đăng</h3>
        <table className="articles-table">
          <thead>
            <tr>
              <th>Article ID</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {user.articles.map((article) => (
              <tr key={article.articleId}>
                <td>{article.articleId}</td>
                <td>{article.title}</td>
                <td>{article.status}</td>
                <td>
                  <button
                    className="detail-button"
                    onClick={() =>
                      navigate(`/article-detail/${article.articleId}`)
                    }
                  >
                    Xem thêm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isBanned && (
        <button className="ban-button" onClick={handleBanUser}>
          Ban from Community
        </button>
      )}
      {isBanned && (
        <p className="banned-message">
          Người dùng đã bị cấm tham gia cộng đồng.
        </p>
      )}
    </div>
  );
};

export default UserActivityManagement;
