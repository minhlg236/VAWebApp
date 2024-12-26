import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Descriptions, Table, Spin, message, Typography } from "antd";
import MainLayout from "../components/MainLayout";

const { Title } = Typography;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const [orderDetailsResponse, paymentResponse] = await Promise.all([
          axios.get(
            `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/getOrderDetailByOrderId/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/getPaymentDetailByOrderId/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setOrderDetails(orderDetailsResponse.data);
        if (paymentResponse.data && paymentResponse.data.length > 0) {
          setPaymentDetails(paymentResponse.data[0]);
        } else {
          setPaymentDetails(null);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        message.error("Không thể tải thông tin chi tiết đơn hàng.");
        navigate("/orders-management");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token, navigate]);

  const orderItemColumns = [
    {
      title: "Tên món",
      dataIndex: "dishName",
      key: "dishName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price?.toLocaleString()} VNĐ`,
    },
  ];

  if (isLoading) {
    return <Spin tip="Đang tải chi tiết đơn hàng..." />;
  }

  const calculateTotalPrice = () => {
    return orderDetails.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <MainLayout title={`Chi tiết đơn hàng #${id}`}>
      <Card
        title={<Title level={3}>Thông tin đơn hàng</Title>}
        style={{ marginBottom: 24 }}
      >
        <Descriptions bordered column={1}>
          {orderDetails.length > 0 && orderDetails[0].deliveryAddress && (
            <Descriptions.Item label="Địa chỉ giao hàng">
              {orderDetails[0].deliveryAddress || "Không có dữ liệu"}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Tổng giá">
            {calculateTotalPrice().toLocaleString()} VNĐ
          </Descriptions.Item>
          {orderDetails.length > 0 && orderDetails[0].note && (
            <Descriptions.Item label="Ghi chú">
              {orderDetails[0].note || "Không có dữ liệu"}
            </Descriptions.Item>
          )}
          {orderDetails.length > 0 &&
            orderDetails[0].deliveryFee !== undefined && (
              <Descriptions.Item label="Phí giao hàng">
                {orderDetails[0].deliveryFee?.toLocaleString() ||
                  "Không có dữ liệu"}{" "}
                VNĐ
              </Descriptions.Item>
            )}
          {orderDetails.length > 0 && orderDetails[0].orderStatus && (
            <Descriptions.Item label="Trạng thái đơn hàng">
              {orderDetails[0].orderStatus || "Không có dữ liệu"}
            </Descriptions.Item>
          )}
          {orderDetails.length > 0 && orderDetails[0].orderDate && (
            <Descriptions.Item label="Ngày tạo">
              {new Date(orderDetails[0].orderDate).toLocaleString("vi-VN")}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title={<Title level={4}>Thông tin món ăn</Title>}>
        <Table
          dataSource={orderDetails}
          columns={orderItemColumns}
          rowKey="orderDetailId"
          pagination={false}
        />
      </Card>

      <Card
        title={<Title level={4}>Thông tin thanh toán</Title>}
        style={{ marginTop: 24 }}
      >
        {paymentDetails ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Phương thức thanh toán">
              {paymentDetails.paymentMethod || "Không có dữ liệu"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {paymentDetails.paymentStatus || "Không có dữ liệu"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian thanh toán">
              {paymentDetails.paymentDate
                ? new Date(paymentDetails.paymentDate).toLocaleString("vi-VN")
                : "Không có dữ liệu"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có thông tin thanh toán.</p>
        )}
      </Card>
    </MainLayout>
  );
};

export default OrderDetail;
