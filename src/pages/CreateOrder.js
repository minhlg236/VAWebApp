import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateOrder.css";

const CreateOrder = () => {
  const [userId, setUserId] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [status, setStatus] = useState("pending");
  const [completedTime, setCompletedTime] = useState("");
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  const handleCreateOrder = (e) => {
    e.preventDefault();
    // Xử lý logic tạo đơn hàng ở đây
    console.log({
      userId,
      totalPrice,
      orderDate,
      deliveryAddress,
      deliveryFee,
      status,
      completedTime,
      note,
    });
    navigate("/orders"); // Điều hướng sau khi tạo xong
  };

  return (
    <div className="create-order-container">
      <h2>Tạo đơn hàng mới</h2>
      <form onSubmit={handleCreateOrder}>
        <div className="order-input-group">
          <label htmlFor="userId">ID Người dùng</label>
          <input
            type="number"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Nhập ID người dùng"
            required
          />
        </div>
        <div className="order-input-group">
          <label htmlFor="totalPrice">Tổng giá (VNĐ)</label>
          <input
            type="number"
            id="totalPrice"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            placeholder="Nhập tổng giá"
            required
          />
        </div>
        <div className="order-input-group">
          <label htmlFor="orderDate">Ngày đặt hàng</label>
          <input
            type="date"
            id="orderDate"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            required
          />
        </div>
        <div className="order-input-group">
          <label htmlFor="deliveryAddress">Địa chỉ giao hàng</label>
          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Nhập địa chỉ giao hàng"
            required
          />
        </div>
        <div className="order-input-group">
          <label htmlFor="deliveryFee">Phí giao hàng (VNĐ)</label>
          <input
            type="number"
            id="deliveryFee"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.value)}
            placeholder="Nhập phí giao hàng"
            required
          />
        </div>
        <div className="order-input-group">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="delivering">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="canceled">Đã hủy</option>
            <option value="failed">Giao hàng thất bại</option>
          </select>
        </div>
        <div className="order-input-group">
          <label htmlFor="completedTime">Thời gian hoàn thành</label>
          <input
            type="datetime-local"
            id="completedTime"
            value={completedTime}
            onChange={(e) => setCompletedTime(e.target.value)}
          />
        </div>
        <div className="order-input-group">
          <label htmlFor="note">Ghi chú</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú cho đơn hàng"
          />
        </div>
        <div className="order-create-button">
          <button type="submit">Tạo đơn hàng</button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
