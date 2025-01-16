import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  InputNumber,
  message,
} from "antd";
import MainLayout from "../components/MainLayout";

const { Option } = Select;
const { Title } = Typography;

const CreateNutritionCriteria = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isCreatingCriteria, setIsCreatingCriteria] = useState(false);

  const nutrientLabels = {
    calories: "Calo",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Chất béo",
    fiber: "Chất xơ",
    vitaminA: "Vitamin A",
    vitaminB: "Vitamin B",
    vitaminC: "Vitamin C",
    vitaminD: "Vitamin D",
    vitaminE: "Vitamin E",
    calcium: "Canxi",
    iron: "Sắt",
    magnesium: "Magie",
    omega3: "Omega 3",
    sugars: "Đường",
    cholesterol: "Cholesterol",
    sodium: "Natri",
  };

  const handleCreateNutritionCriteria = async (values) => {
    setIsCreatingCriteria(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/nutritionCriterions/createNutritionCriteria",
        {
          ...values,
          profession: "0", // Always set to "0"
          calories: parseFloat(values.calories || 0),
          protein: parseFloat(values.protein || 0),
          carbs: parseFloat(values.carbs || 0),
          fat: parseFloat(values.fat || 0),
          fiber: parseFloat(values.fiber || 0),
          vitaminA: parseFloat(values.vitaminA || 0),
          vitaminB: parseFloat(values.vitaminB || 0),
          vitaminC: parseFloat(values.vitaminC || 0),
          vitaminD: parseFloat(values.vitaminD || 0),
          vitaminE: parseFloat(values.vitaminE || 0),
          calcium: parseFloat(values.calcium || 0),
          iron: parseFloat(values.iron || 0),
          magnesium: parseFloat(values.magnesium || 0),
          omega3: parseFloat(values.omega3 || 0),
          sugars: parseFloat(values.sugars || 0),
          cholesterol: parseFloat(values.cholesterol || 0),
          sodium: parseFloat(values.sodium || 0),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Tiêu chí dinh dưỡng đã được tạo thành công!");
        form.resetFields();
        navigate("/nutritionCriteria-management");
      } else {
        message.error("Tạo tiêu chí dinh dưỡng thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo tiêu chí dinh dưỡng:", error);
      message.error("Tạo tiêu chí dinh dưỡng thất bại. Vui lòng thử lại.");
    } finally {
      setIsCreatingCriteria(false);
    }
  };

  return (
    <MainLayout title="Tạo Tiêu Chí Dinh Dưỡng">
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col span={16}>
          <Card title={<Title level={3}>Tạo Tiêu Chí Dinh Dưỡng Mới</Title>}>
            <Form
              form={form}
              onFinish={handleCreateNutritionCriteria}
              layout="vertical"
            >
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Độ tuổi"
                name="ageRange"
                rules={[{ required: true, message: "Vui lòng nhập độ tuổi!" }]}
              >
                <Input placeholder="Nhập độ tuổi" />
              </Form.Item>

              <Form.Item
                label="BMI"
                name="bmiRange"
                rules={[{ required: true, message: "Vui lòng nhập BMI!" }]}
              >
                <Input placeholder="Nhập BMI" />
              </Form.Item>

              <Form.Item
                label="Mức độ hoạt động"
                name="activityLevel"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn mức độ hoạt động!",
                  },
                ]}
              >
                <Select placeholder="Chọn mức độ hoạt động">
                  <Option value="Cao">Cao</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Ít">Ít</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Mục tiêu"
                name="goal"
                rules={[{ required: true, message: "Vui lòng chọn mục tiêu!" }]}
              >
                <Select placeholder="Chọn mục tiêu">
                  <Option value="Tăng cân">Tăng cân</Option>
                  <Option value="Giữ nguyên">Giữ nguyên</Option>
                  <Option value="Giảm cân">Giảm cân</Option>
                </Select>
              </Form.Item>

              {Object.keys(nutrientLabels).map((key) => (
                <Form.Item key={key} label={nutrientLabels[key]} name={key}>
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder={`Nhập ${nutrientLabels[key]}`}
                  />
                </Form.Item>
              ))}

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isCreatingCriteria}
                  loading={isCreatingCriteria}
                >
                  Tạo Tiêu Chí Dinh Dưỡng
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default CreateNutritionCriteria;
