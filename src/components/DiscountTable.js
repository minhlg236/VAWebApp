import React, { useState } from "react";
import {
  Table,
  Space,
  message,
  InputNumber,
  Button,
  Modal,
  Input,
  Form,
  Tag,
} from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const DiscountTable = ({ rows, setDiscounts }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [editingTier, setEditingTier] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleUpdateDiscount = async (tierId, values) => {
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
      const decimalDiscountRate = values.discountRate / 100;

      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/membershipTiers/updateMembershipTierByTierId`,
        {
          tierId: tierId,
          tierName: values.tierName,
          requiredPoints: values.requiredPoints,
          discountRate: decimalDiscountRate,
          discountEndDate: values.discountEndDate,
          newCreationDate: values.newCreationDate,
        },
        { headers }
      );
      setDiscounts((prevDiscounts) =>
        prevDiscounts.map((discount) =>
          discount.tierId === tierId
            ? { ...discount, ...values, discountRate: decimalDiscountRate }
            : discount
        )
      );
      message.success("Cập nhật giảm giá thành công");
    } catch (error) {
      console.error("Error updating discount rate:", error);
      message.error("Failed to update discount rate.");
    }
  };

  const handleDeleteDiscount = async (tierId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        message.error("Token xác thực không tồn tại. Vui lòng đăng nhập lại.");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/membershipTiers/deleteMembershipTierByTierId/${tierId}`,
        { headers }
      );
      setDiscounts((prevDiscounts) =>
        prevDiscounts.filter((discount) => discount.tierId !== tierId)
      );
      message.success("Xóa giảm giá thành công");
    } catch (error) {
      console.error("Error deleting discount tier:", error);
      message.error("Failed to delete discount tier.");
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      discountRate: record.discountRate * 100,
    });
    setEditingTier(record);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await handleUpdateDiscount(editingTier.tierId, values);
      setIsModalVisible(false);
      form.resetFields();
      setEditingTier(null);
    } catch (error) {
      console.error("Error updating discount tier:", error);
      message.error("Failed to update discount tier.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTier(null);
  };

  const getTagColor = (tierName) => {
    switch (tierName) {
      case "Bronze":
        return "orange";
      case "Silver":
        return "gray";
      case "Gold":
        return "gold";
      case "Platinum":
        return "geekblue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "tierId",
      key: "tierId",
      sorter: (a, b) => a.tierId - b.tierId,
    },
    {
      title: "Tên Bậc",
      dataIndex: "tierName",
      key: "tierName",
      render: (tierName) => <Tag color={getTagColor(tierName)}>{tierName}</Tag>,
    },
    {
      title: "Điểm Yêu Cầu",
      dataIndex: "requiredPoints",
      key: "requiredPoints",
      sorter: (a, b) => a.requiredPoints - b.requiredPoints,
    },
    {
      title: "Mức Discount",
      dataIndex: "discountRate",
      key: "discountRate",
      render: (discountRate) => `${(discountRate * 100).toFixed(2)}%`,
      sorter: (a, b) => a.discountRate - b.discountRate,
    },
    {
      title: "Số Ngày Hết Hạn",
      dataIndex: "discountEndDate",
      key: "discountEndDate",
    },
    {
      title: "Số Ngày Tạo Mới",
      dataIndex: "newCreationDate",
      key: "newCreationDate",
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button
            type="danger"
            onClick={() => handleDeleteDiscount(record.tierId)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="tierId"
        pagination={{
          ...pagination,
          pageSizeOptions: [5, 10, 20],
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title="Sửa giảm giá"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            label="Tên Bậc"
            name="tierName"
            rules={[{ required: true, message: "Please enter tier name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Điểm Yêu Cầu"
            name="requiredPoints"
            rules={[
              { required: true, message: "Please enter required points!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Mức Discount"
            name="discountRate"
            rules={[{ required: true, message: "Please enter discount rate!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>
          <Form.Item label="Số Ngày Hết Hạn" name="discountEndDate">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Số Ngày Tạo Mới" name="newCreationDate">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 10 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

DiscountTable.propTypes = {
  rows: PropTypes.array.isRequired,
  setDiscounts: PropTypes.func.isRequired,
};

export default DiscountTable;
