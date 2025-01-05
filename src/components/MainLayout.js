import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Spin, Button } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ShopOutlined,
  FileTextOutlined,
  FormOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Header, Sider, Content } = Layout;

// Styled components for better responsiveness
const ResponsiveHeader = styled(Header)`
  padding: 0 16px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

const ResponsiveSider = styled(Sider)`
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Ensure it's above other content */
  @media (max-width: 768px) {
    position: absolute;
    height: 100%;
  }
`;

const ContentWrapper = styled(Content)`
  margin: 16px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    margin: 8px;
    padding: 8px;
  }
`;

const HamburgerButton = styled(Button)`
  display: none;
  @media (max-width: 768px) {
    display: block;
    margin-right: 10px;
  }
`;

const MainLayout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siderVisible, setSiderVisible] = useState(true); // Manage sidebar visibility on mobile

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
    setSiderVisible(!siderVisible);
  };

  // Fetch thông tin người dùng
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("authToken");
        const roleIdLocal = localStorage.getItem("roleId");
        setRoleId(parseInt(roleIdLocal)); // Lấy roleId từ localStorage

        const response = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/getUserByID/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Định nghĩa các link cho từng role
  const linksByRole = {
    // Admin
    1: [
      // { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
      { key: "/admin", icon: <UserOutlined />, label: "Quản lý người dùng" },
    ],
    // Staff
    2: [
      {
        key: "/orders-management",
        icon: <ShopOutlined />,
        label: "Quản lý đặt món",
      },
      // {
      //   key: "/shipping-management",
      //   icon: <ProfileOutlined />,
      //   label: "Quản lý ship hàng",
      // },
    ],
    // Moderator
    4: [
      {
        key: "/articleModerate-management",
        icon: <FormOutlined />,
        label: "Quản lý bài viết của khách hàng",
      },
      {
        key: "/moderated-articles",
        icon: <FileTextOutlined />,
        label: "Quản lý bài viết đã duyệt",
      },
      {
        key: "/invalidWord-management",
        icon: <FileTextOutlined />,
        label: "Quản lý từ bị cấm",
      },
    ],
    // Nutritionist
    5: [
      {
        key: "/dishes-management",
        icon: <ShopOutlined />,
        label: "Quản lý món ăn",
      },
      {
        key: "/Ingredient-management",
        icon: <ProfileOutlined />,
        label: "Quản lý nguyên liệu",
      },
      {
        key: "/nutritionCriteria-management",
        icon: <FormOutlined />,
        label: "Quản lý thể trạng",
      },
      {
        key: "/articles-management",
        icon: <FileTextOutlined />,
        label: "Quản lý bài viết",
      },
    ],
  };

  const currentRoleLinks = linksByRole[roleId] || [];

  // Dropdown menu cho thông tin người dùng
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <div>
          <strong>{user?.username || "Người dùng"}</strong>
          <p style={{ margin: 0, color: "#888" }}>{user?.email}</p>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  if (loading) {
    return (
      <Spin tip="Đang tải..." style={{ width: "100%", marginTop: "20%" }} />
    );
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <ResponsiveSider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        breakpoint="lg"
        onCollapse={(collapsed, type) => {
          setCollapsed(collapsed);
          if (type === "responsive") {
            setSiderVisible(!collapsed);
          }
        }}
        style={{
          display: !siderVisible ? "none" : "block",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#001529",
            color: "#fff",
          }}
        >
          <img
            src="https://res.cloudinary.com/dpzzzifpa/image/upload/v1734970532/VEGETARIANSLOGO1-removebg_o2glhi.png"
            alt="Logo"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={currentRoleLinks}
        />
      </ResponsiveSider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <ResponsiveHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <HamburgerButton
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={handleToggleSidebar}
            />

            <h2 style={{ marginLeft: "16px", fontSize: "18px" }}>{title}</h2>
          </div>
          <div>
            {user && (
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    style={{ backgroundColor: "#87d068", marginRight: "8px" }}
                  >
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  <span>{user.username || "Người dùng"}</span>
                </div>
              </Dropdown>
            )}
          </div>
        </ResponsiveHeader>

        {/* Content */}
        <ContentWrapper>{children}</ContentWrapper>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
