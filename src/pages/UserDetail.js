import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Input,
  Select,
  message,
  Row,
  Col,
  Spin,
  Typography,
} from "antd";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../components/MainLayout";

const { Option } = Select;
const { Title } = Typography;
const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }

        const response = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/GetUserByID/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        message.error("Không thể tải thông tin người dùng.");
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetail();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedUser = {
        ...user,
        userId: user.userId,
      };

      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/updateStaff`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Có lỗi xảy ra khi cập nhật.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  if (isLoading) return <Spin tip="Đang tải chi tiết người dùng..." />;
  if (!user) return <p>Không tìm thấy người dùng</p>;

  return (
    <MainLayout title="Chi tiết người dùng">
      <Row gutter={24} style={{ transition: "all 0.3s ease-in-out" }}>
        <Col
          span={showDetail ? 24 : 24}
          style={{
            transition: "all 0.3s ease-in-out",
            paddingRight: showDetail ? "20px" : "0px",
          }}
        >
          <Card
            title={
              <>
                Thông tin chi tiết
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
                {isEditing && (
                  <Button
                    type="primary"
                    onClick={handleUpdate}
                    style={{ marginLeft: 10 }}
                  >
                    Lưu
                  </Button>
                )}
              </>
            }
          >
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tên đăng nhập">
                {isEditing ? (
                  <Input
                    value={user.username}
                    name="username"
                    onChange={handleChange}
                  />
                ) : (
                  user.username
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Mật khẩu">
                {isEditing && user.roleId !== 3 ? (
                  <Input
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu mới"
                    onChange={handleChange}
                  />
                ) : (
                  "**********"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {isEditing && user.roleId !== 3 ? (
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                  />
                ) : (
                  user.email
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {isEditing && user.roleId !== 3 ? (
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleChange}
                  />
                ) : (
                  user.phoneNumber
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {isEditing ? (
                  <Select
                    name="status"
                    value={user.status}
                    onChange={(value) =>
                      setUser((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                ) : user.status === "active" ? (
                  "Active"
                ) : (
                  "Inactive"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                {isEditing ? (
                  <Select
                    name="roleId"
                    value={user.roleId}
                    onChange={(value) =>
                      setUser((prev) => ({ ...prev, roleId: value }))
                    }
                  >
                    <Option value={3}>Customer</Option>
                    <Option value={2}>Staff</Option>
                    <Option value={4}>Moderator</Option>
                    <Option value={5}>Admin</Option>
                  </Select>
                ) : (
                  user.roleId
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {user.address}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {user.gender}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default UserDetail;
