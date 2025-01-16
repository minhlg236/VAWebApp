import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import MainLayout from "../components/MainLayout";

const { Option } = Select;
const { Title } = Typography;

const CreateAccount = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleCreateAccount = async (values) => {
    setIsCreatingAccount(true);
    // Mapping role to roleId
    const roleIdMapping = {
      Staff: 2,
      Moderator: 4,
      Nutritionist: 5,
    };

    const roleId = roleIdMapping[values.role];

    try {
      // API để tạo tài khoản mới
      const response = await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/createstaff",
        {
          username: values.username,
          password: values.password,
          email: `${values.username}@mail.com`, // Email tạm thời hoặc mặc định
          phoneNumber: values.phone,
          status: "active",
          roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Hiển thị thông báo thành công
        message.success(`Tài khoản ${values.role} đã được tạo thành công!`);
        form.resetFields();

        // Reset dữ liệu trong form
      } else {
        message.error("Tạo tài khoản thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      message.error("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <MainLayout title="Tạo Tài Khoản">
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col span={16}>
          <Card title={<Title level={3}>Tạo Tài Khoản Mới</Title>}>
            <Form form={form} onFinish={handleCreateAccount} layout="vertical">
              <Form.Item
                label="Tên đăng nhập"
                name="username"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                ]}
              >
                <Input placeholder="Nhập tên đăng nhập" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                  <Option value="Khác">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="Staff">Staff</Option>
                  <Option value="Moderator">Moderator</Option>
                  <Option value="Nutritionist">Nutritionist</Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isCreatingAccount}
                  loading={isCreatingAccount}
                >
                  Tạo tài khoản
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default CreateAccount;
