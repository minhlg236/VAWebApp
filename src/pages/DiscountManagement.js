// discountManagement.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Spin,
  Tabs,
  message,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import MainLayout from "../components/MainLayout";
import SearchBar from "../components/SearchBar";
import DiscountTable from "../components/DiscountTable";
import axios from "axios";

const { TabPane } = Tabs;

const DiscountManagement = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        const roleId = localStorage.getItem("roleId");

        if (!token || roleId !== "2") {
          message.error("Bạn không có quyền truy cập trang này!");
          navigate("/");
          return;
        }

        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/membershipTiers/allMembershipTier",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDiscounts(response.data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
        message.error("Failed to load discounts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscounts();
  }, [navigate]);

  useEffect(() => {
    if (!discounts || discounts.length === 0) {
      setFilteredDiscounts([]);
      return;
    }
    const filtered = discounts.filter((discount) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "bronze" && discount.tierName === "Bronze") ||
        (activeTab === "silver" && discount.tierName === "Silver") ||
        (activeTab === "gold" && discount.tierName === "Gold") ||
        (activeTab === "platinum" && discount.tierName === "B?ch kim");

      const matchesSearchTerm =
        discount && discount.tierName
          ? discount.tierName.toLowerCase().includes(searchTerm.toLowerCase())
          : false;

      return matchesTab && matchesSearchTerm;
    });

    setFilteredDiscounts(filtered);
  }, [discounts, activeTab, searchTerm]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleCreateDiscount = async (values) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("Token xác thực không tồn tại. Vui lòng đăng nhập lại.");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Convert percentage to decimal before saving
      const decimalDiscountRate = values.discountRate / 100;

      const response = await axios.post(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/membershipTiers/createMembershipTier`,
        {
          tierName: values.tierName,
          requiredPoints: values.requiredPoints,
          discountRate: decimalDiscountRate,
        },
        { headers }
      );

      setDiscounts((prevDiscounts) => [...prevDiscounts, response.data]);
      message.success("Tạo giảm giá thành công");
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error creating discount tier:", error);
      message.error("Failed to create discount tier.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <MainLayout title="Quản lý giảm giá">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Tạo mới
        </Button>
      </div>
      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <TabPane tab="Tất cả" key="all" />
      </Tabs>
      {isLoading ? (
        <Spin tip="Đang tải danh sách giảm giá..." />
      ) : filteredDiscounts.length === 0 ? (
        <div>Không có giảm giá nào để hiển thị.</div>
      ) : (
        <DiscountTable rows={filteredDiscounts} setDiscounts={setDiscounts} />
      )}
      <Modal
        title="Tạo mới giảm giá"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateDiscount} layout="vertical">
          <Form.Item
            label="Tier Name"
            name="tierName"
            rules={[{ required: true, message: "Please enter tier name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Required Points"
            name="requiredPoints"
            rules={[
              { required: true, message: "Please enter required points!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Discount Rate"
            name="discountRate"
            rules={[{ required: true, message: "Please enter discount rate!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 10 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default DiscountManagement;
