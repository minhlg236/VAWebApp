import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  List,
  message,
  Card,
  Row,
  Col,
  Typography,
  Tag, // Import Tag component
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MainLayout from "../components/MainLayout";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const CLOUD_NAME = "dpzzzifpa";
const UPLOAD_PRESET = "vegetarian assistant";

const CreateDish = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientWeight, setIngredientWeight] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [isCreatingDish, setIsCreatingDish] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/allIngredient",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllIngredients(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        message.error("Không thể tải danh sách nguyên liệu. Vui lòng thử lại.");
      }
    };

    fetchAllIngredients();
  }, []);

  const handleSearchIngredient = (value) => {
    setSearchTerm(value);
    if (value) {
      const filtered = allIngredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredIngredients(filtered);
    } else {
      setFilteredIngredients([]);
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const uploadImageToCloudinary = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      message.error("Không thể upload ảnh. Vui lòng thử lại.");
      return "";
    }
  };

  const handleCreateDish = async (values) => {
    setIsCreatingDish(true);
    const file = fileList[0]?.originFileObj;
    const imageUrl = await uploadImageToCloudinary(file);

    const dishPayload = {
      dishId: 0,
      name: values.name,
      dishType: values.dishType,
      description: values.description,
      recipe: values.recipe,
      imageUrl,
      status: "active",
      preferenceName: "Default Preference",
      dietaryPreferenceId: parseInt(values.dietaryPreferenceId),
      price: parseFloat(values.price),
    };

    try {
      const createResponse = await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/dishs/createDish",
        dishPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (createResponse.status === 200) {
        const newDishIdFromCreate = createResponse.data.dishId;
        console.log("New Dish ID from create API:", newDishIdFromCreate);
        try {
          const token = localStorage.getItem("authToken");
          const getAllDishResponse = await axios.get(
            "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/dishs/allDish",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const allDishes = getAllDishResponse.data;
          const newDish = allDishes.find((dish) => dish.name === values.name);

          if (newDish) {
            const newDishId = newDish.dishId;
            console.log("Confirmed New Dish ID:", newDishId);
            if (selectedIngredients.length > 0) {
              await Promise.all(
                selectedIngredients.map(async (ingredientId) => {
                  try {
                    const token = localStorage.getItem("authToken");
                    const payload = {
                      dishId: newDishId,
                      ingredientId: ingredientId,
                      weight: parseFloat(ingredientWeight[ingredientId] || 0),
                    };
                    console.log("Payload to add ingredient:", payload);
                    await axios.post(
                      "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Dish/addIngredient",
                      payload,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );
                    console.log(
                      `Ingredient with ID ${ingredientId} added successfully.`
                    );
                  } catch (error) {
                    console.error(
                      `Error adding ingredient with ID ${ingredientId}:`,
                      error
                    );
                    message.error(
                      `Không thể thêm nguyên liệu có ID ${ingredientId}. Vui lòng thử lại.`
                    );
                  }
                })
              );
            }
            message.success("Tạo món ăn và thêm nguyên liệu thành công!");
            navigate("/dishes-management");
          } else {
            message.error("Không tìm thấy món ăn vừa tạo.");
          }
        } catch (error) {
          console.error("Error fetching all dish or find new dish:", error);
          message.error(
            "Không thể lấy danh sách món ăn hoặc tìm dish vừa tạo. Vui lòng thử lại."
          );
        }
      } else {
        message.error("Tạo món ăn thất bại.");
      }
    } catch (error) {
      console.error(
        "Lỗi trong quá trình tạo món ăn và thêm nguyên liệu:",
        error
      );
      message.error(
        "Không thể tạo món ăn và thêm nguyên liệu. Vui lòng thử lại."
      );
    } finally {
      setIsCreatingDish(false);
    }
  };

  const handleIngredientSelect = (ingredientId) => {
    if (selectedIngredients.includes(ingredientId)) {
      setSelectedIngredients(
        selectedIngredients.filter((id) => id !== ingredientId)
      );
      const { [ingredientId]: removedWeight, ...restWeights } =
        ingredientWeight;
      setIngredientWeight(restWeights);
    } else {
      setSelectedIngredients([...selectedIngredients, ingredientId]);
      setIngredientWeight((prevWeights) => ({
        ...prevWeights,
        [ingredientId]: 0,
      }));
    }
    setSearchTerm("");
    setFilteredIngredients([]);
  };

  const handleRemoveSelectedIngredient = (ingredientId) => {
    setSelectedIngredients(
      selectedIngredients.filter((id) => id !== ingredientId)
    );
    const { [ingredientId]: removedWeight, ...restWeights } = ingredientWeight;
    setIngredientWeight(restWeights);
  };

  const handleWeightChange = (ingredientId, value) => {
    setIngredientWeight((prevWeights) => ({
      ...prevWeights,
      [ingredientId]: value,
    }));
  };

  return (
    <MainLayout title="Tạo Món Ăn">
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col span={16}>
          <Card title={<Title level={3}>Tạo Món Ăn Mới</Title>}>
            <Form form={form} onFinish={handleCreateDish} layout="vertical">
              <Form.Item
                label="Tên món ăn"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên món ăn!" },
                ]}
              >
                <Input placeholder="Nhập tên món ăn" />
              </Form.Item>

              <Form.Item
                label="Loại món ăn"
                name="dishType"
                rules={[
                  { required: true, message: "Vui lòng chọn loại món ăn!" },
                ]}
              >
                <Select placeholder="Chọn loại món ăn">
                  <Option value="Món chính sáng">Món chính sáng</Option>
                  <Option value="Món chính trưa">Món chính trưa</Option>
                  <Option value="Món chính tối">Món chính tối</Option>
                  <Option value="Khai vị sáng">Khai vị sáng</Option>
                  <Option value="Khai vị trưa">Khai vị trưa</Option>
                  <Option value="Khai vị tối">Khai vị tối</Option>
                  <Option value="Tráng miệng sáng">Tráng miệng sáng</Option>
                  <Option value="Tráng miệng trưa">Tráng miệng trưa</Option>
                  <Option value="Tráng miệng tối">Tráng miệng tối</Option>
                  <Option value="Đồ uống">Đồ uống</Option>
                  <Option value="Canh">Canh</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <TextArea
                  placeholder="Nhập mô tả món ăn"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>

              <Form.Item
                label="Công thức"
                name="recipe"
                rules={[
                  { required: true, message: "Vui lòng nhập công thức!" },
                ]}
              >
                <TextArea
                  placeholder="Nhập công thức món ăn"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>

              <Form.Item
                label="Ảnh món ăn"
                name="imageFile"
                rules={[
                  { required: true, message: "Vui lòng chọn ảnh món ăn!" },
                ]}
              >
                <Upload
                  fileList={fileList}
                  onChange={handleImageChange}
                  beforeUpload={() => false}
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Sở thích dinh dưỡng"
                name="dietaryPreferenceId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn sở thích dinh dưỡng!",
                  },
                ]}
              >
                <Select placeholder="Chọn sở thích dinh dưỡng">
                  <Option value="1">Vegan</Option>
                  <Option value="2">Lacto</Option>
                  <Option value="3">Ovo</Option>
                  <Option value="4">Lacto-Ovo</Option>
                  <Option value="5">Pescatarian</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Giá (VNĐ)"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập giá món ăn"
                />
              </Form.Item>

              <div style={{ marginTop: "20px" }}>
                <label>Chọn nguyên liệu:</label>
                <Input.Search
                  placeholder="Tìm kiếm nguyên liệu"
                  value={searchTerm}
                  onChange={(e) => handleSearchIngredient(e.target.value)}
                  onSearch={handleSearchIngredient}
                />
                {filteredIngredients.length > 0 && (
                  <Card style={{ marginTop: 16 }}>
                    <List
                      dataSource={filteredIngredients}
                      renderItem={(ingredient) => (
                        <List.Item
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleIngredientSelect(ingredient.ingredientId)
                          }
                        >
                          {ingredient.name}
                        </List.Item>
                      )}
                    />
                  </Card>
                )}
              </div>

              {selectedIngredients.length > 0 && (
                <Card title="Nguyên liệu đã chọn" style={{ marginTop: 24 }}>
                  {selectedIngredients.map((ingredientId) => {
                    const selectedIngredient = allIngredients.find(
                      (item) => item.ingredientId === ingredientId
                    );
                    return selectedIngredient ? (
                      <Tag
                        key={ingredientId}
                        closable
                        onClose={() =>
                          handleRemoveSelectedIngredient(ingredientId)
                        }
                        style={{ marginBottom: 8 }}
                      >
                        {selectedIngredient.name}
                        <InputNumber
                          style={{ width: 100, marginLeft: 8 }}
                          size="small"
                          min={0}
                          placeholder="Khối lượng (g)"
                          value={ingredientWeight[ingredientId] || 0}
                          onChange={(value) =>
                            handleWeightChange(ingredientId, value)
                          }
                        />
                        g
                      </Tag>
                    ) : null;
                  })}
                </Card>
              )}

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isCreatingDish}
                  loading={isCreatingDish}
                >
                  Tạo món ăn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default CreateDish;
