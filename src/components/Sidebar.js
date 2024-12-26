// import React, { useEffect, useState } from "react";
// import { Menu, Layout, Avatar } from "antd";
// import { useNavigate } from "react-router-dom";
// import {
//   DashboardOutlined,
//   UserOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";
// import axios from "axios";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const userId = localStorage.getItem("userId");
//         const token = localStorage.getItem("authToken");
//         const response = await axios.get(
//           `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/getUserByID/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setUser(response.data);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <Layout.Sider theme="light" width={250}>
//       <div style={{ padding: "16px", textAlign: "center" }}>
//         {user && (
//           <>
//             <Avatar size={64} style={{ backgroundColor: "#87d068" }}>
//               {user.username?.charAt(0).toUpperCase()}
//             </Avatar>
//             <p>{user.username}</p>
//           </>
//         )}
//       </div>
//       <Menu
//         mode="inline"
//         onClick={({ key }) =>
//           key === "logout" ? handleLogout() : navigate(key)
//         }
//         items={[
//           {
//             key: "/dashboard",
//             icon: <DashboardOutlined />,
//             label: "Dashboard",
//           },
//           {
//             key: "/admin",
//             icon: <UserOutlined />,
//             label: "Quản lý người dùng",
//           },
//           {
//             key: "logout",
//             icon: <LogoutOutlined />,
//             label: "Đăng xuất",
//           },
//         ]}
//       />
//     </Layout.Sider>
//   );
// };

// export default Sidebar;
