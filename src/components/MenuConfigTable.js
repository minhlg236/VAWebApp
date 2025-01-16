// menuconfigtable.js
import React, { useState } from "react";
import { Table, Space, message, InputNumber, Button, Modal, Form } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const MenuConfigTable = ({ rows, setMenuConfigs }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [editingConfig, setEditingConfig] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleUpdateConfig = async (menuConfigId, values) => {
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
      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/menuconfigs/updateMenuConfigByMenuConfigId`,
        {
          menuConfigId: menuConfigId,
          menuBreakfast: values.menuBreakfast,
          menuLunch: values.menuLunch,
          menuDinner: values.menuDinner,
        },
        { headers }
      );
      setMenuConfigs((prevConfigs) =>
        prevConfigs.map((config) =>
          config.menuConfigId === menuConfigId
            ? { ...config, ...values }
            : config
        )
      );
      message.success("Cập nhật cấu hình menu thành công");
    } catch (error) {
      console.error("Error updating menu config:", error);
      message.error("Failed to update menu config.");
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingConfig(record);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await handleUpdateConfig(editingConfig.menuConfigId, values);
      setIsModalVisible(false);
      form.resetFields();
      setEditingConfig(null);
    } catch (error) {
      console.error("Error updating menu config:", error);
      message.error("Failed to update menu config.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingConfig(null);
  };

  const columns = [
    {
      title: "Menu Config ID",
      dataIndex: "menuConfigId",
      key: "menuConfigId",
      sorter: (a, b) => a.menuConfigId - b.menuConfigId,
    },
    {
      title: "Menu Breakfast",
      dataIndex: "menuBreakfast",
      key: "menuBreakfast",
      render: (text, record) => record?.menuBreakfast,
    },
    {
      title: "Menu Lunch",
      dataIndex: "menuLunch",
      key: "menuLunch",
      render: (text, record) => record?.menuLunch,
    },
    {
      title: "Menu Dinner",
      dataIndex: "menuDinner",
      key: "menuDinner",
      render: (text, record) => record?.menuDinner,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
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
        rowKey="menuConfigId"
        pagination={{
          ...pagination,
          pageSizeOptions: [5, 10, 20],
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title="Sửa dinh dưỡng menu"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            label="Menu Breakfast"
            name="menuBreakfast"
            rules={[
              {
                required: true,
                message: "Please enter amount of nutrition for breakfast menu!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Menu Lunch"
            name="menuLunch"
            rules={[
              {
                required: true,
                message: "Please enter amount of nutrition for lunch menu!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Menu Dinner"
            name="menuDinner"
            rules={[
              {
                required: true,
                message: "Please enter amount of nutrition for dinner menu!",
              },
            ]}
          >
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

MenuConfigTable.propTypes = {
  rows: PropTypes.array.isRequired,
  setMenuConfigs: PropTypes.func.isRequired,
};

export default MenuConfigTable;
