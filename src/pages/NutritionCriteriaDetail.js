import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Input,
  Select,
  Form,
  message,
  Typography,
  Spin,
  Row,
  Col,
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../components/MainLayout";

const { Title } = Typography;
const { Option } = Select;

const NutritionCriteriaDetail = () => {
  const { id } = useParams();
  const [criteria, setCriteria] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Nutrition Criteria details by ID
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/nutritionCriterions/getNutritionCriteriaDetailByCriteriaId/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCriteria(response.data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết tiêu chí dinh dưỡng:", error);
        message.error("Không thể tải chi tiết tiêu chí dinh dưỡng.");
        navigate("/nutritionCriteria-management");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCriteria();
  }, [id, navigate]);

  // Handle updating Nutrition Criteria
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/nutritionCriterions/updateNutritionCriteriaByCriteriaId`,
        criteria,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Cập nhật tiêu chí dinh dưỡng thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật tiêu chí dinh dưỡng:", error);
      message.error("Không thể cập nhật tiêu chí dinh dưỡng.");
    }
  };

  if (isLoading) {
    return <Spin tip="Đang tải chi tiết tiêu chí dinh dưỡng..." />;
  }

  return (
    <MainLayout title="Chi Tiết Tiêu Chí Dinh Dưỡng">
      <Row gutter={24}>
        <Col span={24}>
          <Card
            title={
              <>
                Chi Tiết Tiêu Chí Dinh Dưỡng
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
              <Descriptions.Item label="Giới Tính">
                {isEditing ? (
                  <Select
                    value={criteria.gender}
                    onChange={(value) =>
                      setCriteria((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                  </Select>
                ) : (
                  criteria.gender || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Độ Tuổi">
                {isEditing ? (
                  <Input
                    value={criteria.ageRange}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        ageRange: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.ageRange || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Chỉ Số BMI">
                {isEditing ? (
                  <Input
                    value={criteria.bmiRange}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        bmiRange: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.bmiRange || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Nghề Nghiệp">
                {isEditing ? (
                  <Input
                    value={criteria.profession}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        profession: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.profession || "Không có dữ liệu"
                )}
              </Descriptions.Item> */}
              <Descriptions.Item label="Mức Độ Hoạt Động">
                {isEditing ? (
                  <Select
                    value={criteria.activityLevel}
                    onChange={(value) =>
                      setCriteria((prev) => ({ ...prev, activityLevel: value }))
                    }
                  >
                    <Option value="Cao">Cao</Option>
                    <Option value="Trung bình">Trung bình</Option>
                    <Option value="Ít">Ít</Option>
                  </Select>
                ) : (
                  criteria.activityLevel || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Mục Tiêu">
                {isEditing ? (
                  <Select
                    value={criteria.goal}
                    onChange={(value) =>
                      setCriteria((prev) => ({ ...prev, goal: value }))
                    }
                  >
                    <Option value="Tăng cân">Tăng cân</Option>
                    <Option value="Giữ nguyên">Giữ nguyên</Option>
                    <Option value="Giảm cân">Giảm cân</Option>
                  </Select>
                ) : (
                  criteria.goal || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Lượng Calo (kcal)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.calories}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        calories: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.calories || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Lượng Protein (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.protein}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        protein: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.protein || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Lượng Carbs (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.carbs}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        carbs: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.carbs || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Lượng Chất Béo (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.fat}
                    onChange={(e) =>
                      setCriteria((prev) => ({ ...prev, fat: e.target.value }))
                    }
                  />
                ) : (
                  criteria.fat || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Lượng Chất Xơ (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.fiber}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        fiber: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.fiber || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Vitamin A (IU)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.vitaminA}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        vitaminA: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.vitaminA || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Vitamin B (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.vitaminB}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        vitaminB: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.vitaminB || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Vitamin C (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.vitaminC}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        vitaminC: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.vitaminC || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Vitamin D (IU)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.vitaminD}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        vitaminD: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.vitaminD || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Vitamin E (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.vitaminE}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        vitaminE: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.vitaminE || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Canxi (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.calcium}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        calcium: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.calcium || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Sắt (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.iron}
                    onChange={(e) =>
                      setCriteria((prev) => ({ ...prev, iron: e.target.value }))
                    }
                  />
                ) : (
                  criteria.iron || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Magie (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.magnesium}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        magnesium: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.magnesium || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Omega-3 (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.omega3}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        omega3: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.omega3 || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Đường (g)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.sugars}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        sugars: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.sugars || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Cholesterol (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.cholesterol}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        cholesterol: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.cholesterol || "Không có dữ liệu"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Natri (mg)">
                {isEditing ? (
                  <Input
                    type="number"
                    value={criteria.sodium}
                    onChange={(e) =>
                      setCriteria((prev) => ({
                        ...prev,
                        sodium: e.target.value,
                      }))
                    }
                  />
                ) : (
                  criteria.sodium || "Không có dữ liệu"
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default NutritionCriteriaDetail;
