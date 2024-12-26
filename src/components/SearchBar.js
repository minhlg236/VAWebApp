import React from "react";
import { Input } from "antd";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <Input
        placeholder="Nhập từ khóa tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
