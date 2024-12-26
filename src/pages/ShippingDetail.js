import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ShippingDetail.css";
import Sidebar from "../components/Sidebar"; // Import Sidebar

const ShippingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);
  const token = localStorage.getItem("authToken");

  const handleCancelShipping = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn vận chuyển này?")) {
      return;
    }

    try {
      await axios.get(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/shipping/cancel?trackingId=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Đơn vận chuyển đã được hủy.");
      navigate("/shipping-management");
    } catch (error) {
      console.error("Lỗi hủy đơn vận chuyển:", error);
      alert("Không thể hủy đơn vận chuyển.");
    }
  };

  useEffect(() => {
    const fetchShippingAndOrderDetails = async () => {
      try {
        const shippingResponse = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/shipping/get-by-tracking-id?trackingId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShipping(shippingResponse.data);

        const orderDetailResponse = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/orders/getOrderDetailByOrderId/${shippingResponse.data.orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrderDetails(orderDetailResponse.data);
      } catch (error) {
        console.error("Error fetching shipping/order details:", error);
        alert("Could not load shipping or order details.");
        navigate("/shipping-management");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShippingAndOrderDetails();
  }, [id, token, navigate]);

  if (isLoading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (!shipping) {
    return <div>Không tìm thấy thông tin vận chuyển.</div>;
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <div className="content">
        <div className="top-buttons">
          <button
            className="back-button"
            onClick={() => navigate("/shipping-management")}
          >
            Quay lại
          </button>
          <button className="cancel-button" onClick={handleCancelShipping}>
            Hủy đơn
          </button>
        </div>
        <div className="shipping-detail-container">
          <h2>Thông tin chi tiết vận chuyển</h2>
          <div className="shipping-info">
            <p>
              <strong>Shipping ID:</strong> {shipping.id}
            </p>
            <p>
              <strong>Trạng thái:</strong> {shipping.statusText}
            </p>
            <p>
              <strong>Customer Name:</strong> {shipping.customerFullname}
            </p>
            <p>
              <strong>Customer Phone:</strong> {shipping.customerTel}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {shipping.address}
            </p>
            <p>
              <strong>Mã vận đơn:</strong> {shipping.trackingId}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {shipping.created
                ? new Date(shipping.created).toLocaleString("vi-VN")
                : "Không có dữ liệu"}
            </p>
            <p>
              <strong>Ngày chỉnh sửa:</strong>{" "}
              {shipping.modified
                ? new Date(shipping.modified).toLocaleString("vi-VN")
                : "Không có dữ liệu"}
            </p>
            <p>
              <strong>Ghi chú:</strong> {shipping.message}
            </p>
            <p>
              <strong>Giá trị:</strong>{" "}
              {shipping.value ? `${shipping.value} VND` : "Không có dữ liệu"}
            </p>
            <p>
              <strong>Phí vận chuyển:</strong>{" "}
              {shipping.shipMoney
                ? `${shipping.shipMoney} VND`
                : "Không có dữ liệu"}
            </p>
            <p>
              <strong>Phí pick:</strong>{" "}
              {shipping.pickMoney
                ? `${shipping.pickMoney} VND`
                : "Không có dữ liệu"}
            </p>
            <p>
              <strong>User ID:</strong> {shipping.userId}
            </p>
            <p>
              <strong>Order ID:</strong> {shipping.orderId}
            </p>
          </div>

          <div className="order-section">
            <h2>Thông tin món ăn</h2>
            {orderDetails.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tên món</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((item) => (
                    <tr key={item.orderDetailId}>
                      <td>{item.dishName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Không có món ăn nào trong đơn hàng.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetail;
