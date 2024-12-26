import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin, message, Modal, Input } from "antd";
import MainLayout from "../components/MainLayout";
import SearchBar from "../components/SearchBar";
import InvalidWordTable from "../components/InvalidWordTable";
import axios from "axios";

const InvalidWordManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [invalidWords, setInvalidWords] = useState([]);
  const [filteredInvalidWords, setFilteredInvalidWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newInvalidWord, setNewInvalidWord] = useState("");

  // Thêm các state cho modal cập nhật từ
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [wordToUpdate, setWordToUpdate] = useState(null);
  const [updatedInvalidWord, setUpdatedInvalidWord] = useState("");

  // Hàm fetchInvalidWords được định nghĩa bằng useCallback để có thể gọi lại từ nhiều nơi
  const fetchInvalidWords = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/invalid-word/getall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInvalidWords(response.data);
      // Không cần setFilteredInvalidWords ở đây nữa, useEffect sẽ xử lý
    } catch (error) {
      console.error("Error fetching invalid words:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/");
      } else {
        message.error("Đã xảy ra lỗi khi tải danh sách từ bị cấm.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Gọi fetchInvalidWords khi component mount
  useEffect(() => {
    fetchInvalidWords();
  }, [fetchInvalidWords]);

  // useEffect để lọc danh sách từ dựa trên searchTerm và invalidWords
  useEffect(() => {
    const filtered = invalidWords.filter((word) =>
      word.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvalidWords(filtered);
  }, [searchTerm, invalidWords]);

  const handleAddInvalidWord = () => {
    setIsAddModalVisible(true);
  };

  const handleCancelAddModal = () => {
    setIsAddModalVisible(false);
    setNewInvalidWord("");
  };

  const handleCreateInvalidWord = async () => {
    if (!newInvalidWord.trim()) {
      message.warning("Vui lòng nhập từ bị cấm.");
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/invalid-word/add",
        {
          content: newInvalidWord.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Thêm từ bị cấm thành công.");
      setNewInvalidWord("");
      setIsAddModalVisible(false);
      // Tải lại danh sách từ sau khi thêm thành công
      await fetchInvalidWords();
    } catch (error) {
      console.error("Error adding invalid word:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Không thể thêm từ bị cấm.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm mở modal cập nhật từ
  const openUpdateModal = (word) => {
    setWordToUpdate(word);
    setUpdatedInvalidWord(word.content);
    setIsUpdateModalVisible(true);
  };

  const handleCancelUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setWordToUpdate(null);
    setUpdatedInvalidWord("");
  };

  const handleUpdateInvalidWord = async () => {
    if (!updatedInvalidWord.trim()) {
      message.warning("Vui lòng nhập từ bị cấm mới.");
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await axios.put(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/invalid-word/update",
        {
          content: wordToUpdate.content,
          newContent: updatedInvalidWord.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Cập nhật từ bị cấm thành công.");
      setIsUpdateModalVisible(false);
      setWordToUpdate(null);
      setUpdatedInvalidWord("");
      // Tải lại danh sách từ sau khi cập nhật thành công
      await fetchInvalidWords();
    } catch (error) {
      console.error("Error updating invalid word:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Không thể cập nhật từ bị cấm.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvalidWord = async (content) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      await axios.delete(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/invalid-word/remove",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            content: content,
          },
        }
      );
      message.success("Xóa từ bị cấm thành công.");
      // Tải lại danh sách từ sau khi xóa thành công
      await fetchInvalidWords();
    } catch (error) {
      console.error("Error deleting invalid word:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Không thể xóa từ bị cấm.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Quản lý từ bị cấm">
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button type="primary" onClick={handleAddInvalidWord}>
          Thêm từ bị cấm
        </Button>
      </div>
      {isLoading ? (
        <Spin tip="Đang tải danh sách từ bị cấm..." />
      ) : filteredInvalidWords.length === 0 ? (
        <div>Không có từ bị cấm nào để hiển thị.</div>
      ) : (
        <InvalidWordTable
          invalidWords={filteredInvalidWords}
          onUpdate={openUpdateModal} // Truyền hàm mở modal cập nhật
          onDelete={handleDeleteInvalidWord}
        />
      )}
      {/* Modal thêm từ mới */}
      <Modal
        title="Thêm từ bị cấm mới"
        visible={isAddModalVisible}
        onOk={handleCreateInvalidWord}
        onCancel={handleCancelAddModal}
        okButtonProps={{ disabled: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
      >
        <Input
          placeholder="Nhập từ bị cấm"
          value={newInvalidWord}
          onChange={(e) => setNewInvalidWord(e.target.value)}
          onPressEnter={handleCreateInvalidWord}
        />
      </Modal>
      {/* Modal cập nhật từ */}
      <Modal
        title="Cập nhật từ bị cấm"
        visible={isUpdateModalVisible}
        onOk={handleUpdateInvalidWord}
        onCancel={handleCancelUpdateModal}
        okButtonProps={{ disabled: isLoading }}
        cancelButtonProps={{ disabled: isLoading }}
      >
        <Input
          placeholder="Nhập từ bị cấm mới"
          value={updatedInvalidWord}
          onChange={(e) => setUpdatedInvalidWord(e.target.value)}
          onPressEnter={handleUpdateInvalidWord}
        />
      </Modal>
    </MainLayout>
  );
};

export default InvalidWordManagement;
