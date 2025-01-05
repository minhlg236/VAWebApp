import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Spin,
  message,
  Descriptions,
  Space,
  Tag,
  Avatar,
  Image,
  Divider,
} from "antd";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import MainLayout from "../components/MainLayout";

const { Title, Text } = Typography;
const licenseKey =
  "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzczMzExOTksImp0aSI6ImQ1MTEwZmQzLWFmM2YtNGZiYS1iOWQyLWYwMDk4OWI0NjE2ZSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjA1ZjNiYTc5In0.k8ebruq03MuqKM_UHF7qLwhru5ArgHu1x8w4U8ipPfJ6uZxr-j_6lS35RvVQ8U0ee8OVbs8Nb4uwCjR8GQIjIg";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [articleImages, setArticleImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [moderateDate, setModerateDate] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const roleId = parseInt(localStorage.getItem("roleId"));
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !roleId) {
      message.error("Bạn cần đăng nhập để truy cập trang này!");
      return;
    }
  }, [roleId]);

  useEffect(() => {
    const fetchArticleImages = async () => {
      try {
        const response = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articleImages/getArticleImageByArticleId/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setArticleImages(response.data);
      } catch (error) {
        console.error("Error fetching article images:", error);
      }
    };
    fetchArticleImages();
  }, [id]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Article/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setArticle(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content,
          authorId: response.data.authorId,
          authorName: response.data.authorName,
        });
        setModerateDate(response.data.moderateDate);
        setCurrentStatus(response.data.status || "pending");
      } catch (error) {
        console.error("Lỗi khi tải thông tin bài viết:", error);
        message.error("Không thể tải thông tin bài viết.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      const payload = {
        articleId: article.articleId,
        title: formData.title,
        content: formData.content,
        status: currentStatus,
        authorId: article.authorId,
      };

      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articles/updateArticleByArticleId`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      message.success("Cập nhật bài viết thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      message.error("Không thể cập nhật bài viết.");
    }
  };

  const fetchFollowers = async (authorId) => {
    try {
      const response = await axios.get(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/follows/allFollowerByUserId/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching followers:", error);
      return [];
    }
  };

  const sendNotification = async (userId, notificationType, content) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const response = await axios.post(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/notifications/sendNotification`,
        {},
        {
          params: {
            userId,
            notificationType,
            content,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Notification sent successfully:", response.data);
      } else {
        console.error("Failed to send notification:", response);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleChangeStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/articles/updateArticleStatusByArticleId/${article.articleId}?newStatus=${newStatus}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const notificationContent =
        newStatus === "accepted"
          ? "Bài viết của bạn vừa được phê duyệt và bạn được cộng 20 điểm"
          : "Bài viết của bạn đã bị từ chối";
      await sendNotification(
        article.authorId,
        "new_article",
        notificationContent
      );

      if (newStatus === "accepted") {
        // Gọi API để tăng điểm
        await axios.put(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/customers/EditCustomer/membership/changePoint/${article.authorId}/20`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        // Lấy danh sách người theo dõi
        const followers = await fetchFollowers(article.authorId);
        if (followers && followers.length > 0) {
          for (const follower of followers) {
            await sendNotification(
              follower.followerId,
              "new_article",
              "Người bạn theo dõi vừa đăng bài viết mới"
            );
          }
        }
      }

      setCurrentStatus(newStatus);

      message.success(
        newStatus === "accepted"
          ? "Bài viết đã được chấp nhận và cộng 20 điểm cho tác giả, thông báo đến người theo dõi"
          : "Bài viết đã bị từ chối và thông báo đến tác giả!"
      );
    } catch (error) {
      console.error("Error changing article status:", error);
      message.error("Không thể thay đổi trạng thái bài viết.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) return <Spin tip="Đang tải chi tiết bài viết..." />;

  return (
    <MainLayout title="Chi tiết bài viết">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            bordered={false}
            style={{ borderRadius: 12 }}
            title={
              <Space align="center">
                <Title level={3}>Chi tiết bài viết</Title>
                {roleId === 5 && (
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                  </Button>
                )}
              </Space>
            }
            extra={
              roleId === 4 &&
              currentStatus === "pending" && (
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleChangeStatus("accepted")}
                    loading={isUpdatingStatus}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    type="danger"
                    icon={<CloseOutlined />}
                    onClick={() => handleChangeStatus("rejected")}
                    loading={isUpdatingStatus}
                  >
                    Từ chối
                  </Button>
                </Space>
              )
            }
          >
            {article ? (
              <>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Space align="start">
                      <Avatar size={64} icon={<UserOutlined />} />
                      <div>
                        <Text strong>{formData.authorName}</Text>
                        <br />
                        <Text type="secondary">ID: {formData.authorId}</Text>
                      </div>
                    </Space>
                  </Col>
                </Row>
                <Descriptions bordered column={1} style={{ marginTop: 20 }}>
                  <Descriptions.Item label="Ngày phê duyệt">
                    {moderateDate
                      ? new Date(moderateDate).toLocaleString()
                      : "Chưa được phê duyệt"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag
                      color={
                        currentStatus === "accepted"
                          ? "green"
                          : currentStatus === "rejected"
                          ? "red"
                          : "orange"
                      }
                    >
                      {currentStatus === "accepted"
                        ? "Đã chấp nhận"
                        : currentStatus === "rejected"
                        ? "Đã từ chối"
                        : "Đang chờ duyệt"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tiêu đề">
                    {isEditing ? (
                      <CKEditor
                        editor={ClassicEditor}
                        config={{
                          licenseKey,
                          toolbar: [
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "blockQuote",
                            "|",
                            "imageUpload",
                            "undo",
                            "redo",
                          ],
                        }}
                        data={formData.title}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setFormData((prev) => ({ ...prev, title: data }));
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: article.title }}
                      />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nội dung">
                    {isEditing ? (
                      <CKEditor
                        editor={ClassicEditor}
                        config={{
                          licenseKey,
                          toolbar: [
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "blockQuote",
                            "|",
                            "imageUpload",
                            "undo",
                            "redo",
                          ],
                        }}
                        data={formData.content}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setFormData((prev) => ({ ...prev, content: data }));
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                    )}
                  </Descriptions.Item>
                  {roleId === 4 && ( // Conditional rendering of the entire Descriptions.Item
                    <Descriptions.Item label="Hình ảnh bài viết của khách hàng">
                      <Row gutter={[16, 16]}>
                        {articleImages.map((img) => (
                          <Col
                            key={img.articleImageId}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                          >
                            <Image
                              src={img.imageUrl}
                              alt="Article Image"
                              style={{
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: 8,
                                marginBottom: 16,
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {isEditing && (
                  <Button
                    type="primary"
                    style={{ marginTop: 20 }}
                    onClick={handleSaveChanges}
                  >
                    Lưu thay đổi
                  </Button>
                )}
              </>
            ) : (
              <p>Đang tải thông tin bài viết...</p>
            )}
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default ArticleDetail;
