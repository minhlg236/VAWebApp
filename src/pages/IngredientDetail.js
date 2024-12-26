import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Input,
  Form,
  message,
  Typography,
  Spin,
  Row,
  Col,
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../components/MainLayout";

const { Title } = Typography;

const IngredientDetail = () => {
  const { id } = useParams();
  const [ingredient, setIngredient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu chi tiết nguyên liệu từ API
  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const response = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/getIngredientByIngredientId/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setIngredient(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin nguyên liệu:", error);
        message.error("Không thể tải thông tin nguyên liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredient();
  }, [id]);

  // Hàm xử lý cập nhật thông tin nguyên liệu
  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/updateIngredient`,
        ingredient,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin nguyên liệu:", error);
      message.error("Không thể cập nhật thông tin nguyên liệu.");
    }
  };

  if (isLoading) {
    return <Spin tip="Đang tải thông tin nguyên liệu..." />;
  }

  return (
    <MainLayout title="Chi tiết Nguyên Liệu">
      <Row gutter={24} style={{ transition: "all 0.3s ease-in-out" }}>
        <Col span={24}>
          <Card
            title={
              <>
                {ingredient.name}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
                {isEditing && (
                  <Button
                    type="primary"
                    onClick={handleUpdate}
                    style={{ marginLeft: 10 }}
                    icon={<SaveOutlined />}
                  >
                    Lưu
                  </Button>
                )}
              </>
            }
          >
            <Descriptions bordered column={1} style={{ marginTop: 20 }}>
              <Descriptions.Item label="Tên Nguyên Liệu">
                {isEditing ? (
                  <Input
                    value={ingredient.name}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.name
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Khối lượng (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.weight}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.weight || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Protein (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.protein}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        protein: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.protein || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Calories (kcal)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.calories}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        calories: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.calories || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Carbs (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.carbs}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        carbs: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.carbs || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Chất béo (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.fat}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        fat: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.fat || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Chất xơ (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.fiber}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        fiber: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.fiber || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Natri (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.sodium}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        sodium: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.sodium || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Vitamin A (IU)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.vitaminA}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        vitaminA: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.vitaminA || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Vitamin B (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.vitaminB}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        vitaminB: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.vitaminB || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Vitamin C (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.vitaminC}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        vitaminC: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.vitaminC || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Vitamin D (IU)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.vitaminD}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        vitaminD: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.vitaminD || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Vitamin E (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.vitaminE}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        vitaminE: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.vitaminE || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Canxi (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.calcium}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        calcium: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.calcium || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Sắt (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.iron}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        iron: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.iron || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Magie (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.magnesium}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        magnesium: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.magnesium || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Omega-3 (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.omega3}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        omega3: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.omega3 || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Đường (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.sugars}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        sugars: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.sugars || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Hàm lượng Cholesterol (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={ingredient.cholesterol}
                    onChange={(e) =>
                      setIngredient((prev) => ({
                        ...prev,
                        cholesterol: e.target.value,
                      }))
                    }
                  />
                ) : (
                  ingredient.cholesterol || "Không có dữ liệu"
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default IngredientDetail;
