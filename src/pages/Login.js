import { LockOutlined, MobileOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, Tabs, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";

const ROLES = {
  ADMIN: 1,
  STAFF: 2,
  CUSTOMER: 3,
  MODERATOR: 4,
  NUTRITIONIST: 5,
};

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/customers/login",
        {
          phoneNumber: values.phoneNumber,
          password: values.password,
        }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("roleId", user.roleId);
        localStorage.setItem("userId", user.userId);

        switch (user.roleId) {
          case ROLES.ADMIN:
            navigate("/admin");
            break;
          case ROLES.STAFF:
            navigate("/orders-management");
            break;
          case ROLES.CUSTOMER:
            navigate("/dashboard");
            break;
          case ROLES.MODERATOR:
            navigate("/articleModerate-management");
            break;
          case ROLES.NUTRITIONIST:
            navigate("/dishes-management");
            break;
          default:
            message.error("Vai trò người dùng không xác định!");
        }
      } else {
        message.error("Số điện thoại hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url("https://res.cloudinary.com/dpzzzifpa/image/upload/v1734878791/snapedit_1734878728641_wr4gho.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 8,
          width: 400,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Đăng nhập</h2>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Đăng nhập bằng tài khoản" key="1">
            <Form onFinish={handleLogin} layout="vertical">
              <Form.Item
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input
                  prefix={<MobileOutlined />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                />
              </Form.Item>
              <Form.Item>
                <Checkbox>Tự động đăng nhập</Checkbox>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đăng nhập bằng OTP" key="2">
            <p>Chức năng này đang phát triển...</p>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
