import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreateAccount.css"; // Tạo file CSS để tùy chỉnh giao diện

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Nam");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Staff");
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Mapping role to roleId
    const roleIdMapping = {
      Staff: 2,
      Moderator: 4,
      Nutritionist: 5,
    };

    const roleId = roleIdMapping[role];

    try {
      // API để tạo tài khoản mới
      const response = await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/createstaff",
        {
          username,
          password,
          email: `${username}@mail.com`, // Email tạm thời hoặc mặc định
          phoneNumber: phone,
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
        alert(`Tài khoản ${role} đã được tạo thành công!`);

        // Reset dữ liệu trong form
        setUsername("");
        setPassword("");
        setGender("Nam");
        setPhone("");
        setRole("Staff");
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      alert("Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.");
    }
  };

  return (
    <div className="create-account-container">
      <h2>Tạo tài khoản mới</h2>
      {/* <button
        type="button"
        className="home-button"
        onClick={() => navigate("/")}
      >
        Quay về Home
      </button> */}
      <form onSubmit={handleCreateAccount}>
        <div className="input-group">
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="gender">Giới tính</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="role">Vai trò</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Staff">Staff</option>
            <option value="Moderator">Moderator</option>
            <option value="Nutritionist">Nutritionist</option>
          </select>
        </div>
        <div className="create-button2">
          <button type="submit">Tạo tài khoản</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
