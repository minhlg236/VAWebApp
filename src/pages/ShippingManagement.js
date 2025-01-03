import React from "react";
import MainLayout from "../components/MainLayout";

const ShippingManagement = () => {
  const ghnUrl = "https://5sao.ghn.dev/account"; // URL của Giaohangnhanh

  return (
    <MainLayout title="Shipping">
      <div style={{ height: "80vh", overflow: "hidden" }}>
        <iframe
          src={ghnUrl}
          title="Giaohangnhanh"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </div>
    </MainLayout>
  );
};

export default ShippingManagement;
