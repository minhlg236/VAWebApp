import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Descriptions,
  Table,
  Spin,
  message,
  Typography,
  Button,
} from "antd";
import MainLayout from "../components/MainLayout";

const { Title } = Typography;

// Add Axios Interceptors for logging requests and responses
if (!axios.interceptors.request.handlers.length) {
  axios.interceptors.request.use(
    (config) => {
      if (config.method === "get") {
        console.log(`📥 GET Request: ${config.url}`);
      } else if (config.method === "post") {
        console.log(`📤 POST Request: ${config.url}`);
        console.log("📦 Request Body:", config.data);
      }
      return config;
    },
    (error) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );
}

if (!axios.interceptors.response.handlers.length) {
  axios.interceptors.response.use(
    (response) => {
      console.log(`✅ Response from ${response.config.url}:`, response.data);
      return response;
    },
    (error) => {
      if (error.config) {
        console.error(`❌ Error from ${error.config.url}:`, error.message);
      } else {
        console.error("❌ Response Error:", error.message);
      }
      return Promise.reject(error);
    }
  );
}

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const [creatingNewOrder, setCreatingNewOrder] = useState(false);
  const [originalOrder, setOriginalOrder] = useState(null);
  const [customerUsername, setCustomerUsername] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        const originalOrderResponse = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/getOrderByOrderId/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const orderDataResponse = originalOrderResponse.data;
        const orderObject =
          Array.isArray(orderDataResponse) && orderDataResponse.length > 0
            ? orderDataResponse[0]
            : orderDataResponse;
        setOriginalOrder(orderObject);

        const userId = orderObject.userId;
        const [orderDetailsResponse, paymentResponse, userResponse] =
          await Promise.all([
            axios.get(
              `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/getOrderDetailByOrderId/${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            axios.get(
              `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/getPaymentDetailByOrderId/${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            axios.get(
              `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/getUserByID/${userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
          ]);

        setOrderDetails(orderDetailsResponse.data);
        if (paymentResponse.data && paymentResponse.data.length > 0) {
          setPaymentDetails(paymentResponse.data[0]);
        } else {
          setPaymentDetails(null);
        }
        setCustomerUsername(userResponse.data.username);
      } catch (error) {
        console.error("❌ Error fetching order details:", error);
        message.error("Không thể tải thông tin chi tiết đơn hàng.");
        navigate("/orders-management");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token, navigate]);

  const handleRecreateOrder = async () => {
    let latestOrderId;
    try {
      setCreatingNewOrder(true);
      if (!originalOrder) {
        throw new Error("Không có thông tin order để tạo lại");
      }

      console.log("Original Order:", originalOrder);

      const orderData = {
        userId: originalOrder.userId,
        totalPrice: originalOrder.totalPrice,
        deliveryAddress: originalOrder.deliveryAddress || "Không có địa chỉ",
        note: originalOrder.note || "Không có ghi chú",
        deliveryFee: originalOrder.deliveryFee || 0,
        discountRate: originalOrder.discountRate || 0,
        discountPrice: originalOrder.discountPrice || 0,
        phoneNumber: originalOrder.phoneNumber || "Không có số điện thoại",
        receiverName: originalOrder.receiverName || "Không có tên người nhận",
        orderDate: new Date().toISOString(),
        status: "pending_payment",
        orderCode: originalOrder.orderCode || "",
      };

      console.log("Order Data:", orderData);

      let createOrderResponse;
      try {
        createOrderResponse = await axios.post(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/createOrderByStaff",
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("❌ Error calling createOrderByStaff API:", error);
        message.error("Không thể tạo đơn hàng mới.");
        setCreatingNewOrder(false);
        return;
      }

      if (!createOrderResponse.data) {
        throw new Error("Không thể tạo đơn hàng mới.");
      }
      latestOrderId = createOrderResponse.data.orderId;

      // Fetch latest order ID using getOrderByUserId
      const getOrdersResponse = await axios.get(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/getOrderByUserId/${originalOrder.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!getOrdersResponse.data) {
        throw new Error("Không thể lấy thông tin đơn hàng từ server.");
      }
      const orders = getOrdersResponse.data;
      const latestOrder = orders.reduce((maxOrder, order) =>
        order.orderId > maxOrder.orderId ? order : maxOrder
      );
      latestOrderId = latestOrder.orderId;
      console.log("Latest Order ID:", latestOrderId);

      // Create OrderDetail for each item
      if (orderDetails && orderDetails.length > 0) {
        for (const item of orderDetails) {
          const orderDetailData = {
            orderId: latestOrderId,
            dishId: item.dishId,
            quantity: item.quantity,
            price: item.price,
          };

          try {
            await axios.post(
              "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/createOrderDetail",
              orderDetailData,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          } catch (error) {
            console.error("❌ Error creating order detail:", error);
            throw new Error(
              `Không thể tạo chi tiết đơn hàng cho món: ${item.dishId}`
            );
          }
        }
      }

      const paymentDetailData = {
        orderId: latestOrderId,
        paymentMethod: paymentDetails?.paymentMethod || "Unknown",
        paymentStatus: "pending",
        transactionId: "",
        paymentDate: new Date().toISOString(),
        amount: originalOrder.totalPrice,
        refundAmount: 0,
        returnUrl: "",
        cancelUrl: "",
      };

      let createPaymentDetailResponse;
      try {
        createPaymentDetailResponse = await axios.post(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/payment/create",
          paymentDetailData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("❌ Error calling createPaymentDetail API:", error);
        message.error("Không thể tạo thông tin thanh toán mới.");
        setCreatingNewOrder(false);
        return;
      }

      if (!createPaymentDetailResponse.data) {
        throw new Error("Không thể tạo thông tin thanh toán mới.");
      }
      if (customerUsername) {
        message.success(
          `✅ Đơn hàng của ${customerUsername} đã được tạo lại thành công!`
        );
      } else {
        message.success("✅ Đã tạo lại đơn hàng thành công!");
      }
      navigate(`/orders-management`);
    } catch (error) {
      console.error("❌ Lỗi tạo lại đơn hàng:", error);
      message.error(error.message || "Có lỗi xảy ra khi tạo lại đơn hàng.");
    } finally {
      setCreatingNewOrder(false);
    }
  };

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
          {originalOrder && originalOrder.deliveryAddress && (
            <Descriptions.Item label="Địa chỉ giao hàng">
              {originalOrder.deliveryAddress || "Không có dữ liệu"}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Tổng giá">
            {calculateTotalPrice().toLocaleString()} VNĐ
          </Descriptions.Item>
          {originalOrder && originalOrder.note && (
            <Descriptions.Item label="Ghi chú">
              {originalOrder.note || "Không có dữ liệu"}
            </Descriptions.Item>
          )}
          {originalOrder && originalOrder.deliveryFee !== undefined && (
            <Descriptions.Item label="Phí giao hàng">
              {originalOrder.deliveryFee?.toLocaleString() ||
                "Không có dữ liệu"}{" "}
              VNĐ
            </Descriptions.Item>
          )}
          {originalOrder && originalOrder.status && (
            <Descriptions.Item label="Trạng thái đơn hàng">
              {originalOrder.status || "Không có dữ liệu"}
            </Descriptions.Item>
          )}
          {originalOrder && originalOrder.orderDate && (
            <Descriptions.Item label="Ngày tạo">
              {new Date(originalOrder.orderDate).toLocaleString("vi-VN")}
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
      <Button
        type="primary"
        onClick={handleRecreateOrder}
        loading={creatingNewOrder}
        style={{ marginTop: 20 }}
      >
        Tạo lại đơn hàng
      </Button>
    </MainLayout>
  );
};

export default OrderDetail;
