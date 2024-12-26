import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import MainLayout from "../components/MainLayout";

const { Title } = Typography;

const CreateIngredient = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);

  const handleCreateIngredient = async (values) => {
    setIsCreatingIngredient(true);

    const ingredientPayload = {
      name: values.name,
      calories: parseFloat(values.calories || 0),
      protein: parseFloat(values.protein || 0),
      carbs: parseFloat(values.carbs || 0),
      fat: parseFloat(values.fat || 0),
      weight: parseFloat(values.weight || 0),
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
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/createIngredient",
        ingredientPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Tạo nguyên liệu thành công!");
        navigate("/Ingredient-management");
      }
    } catch (error) {
      console.error("Lỗi khi tạo nguyên liệu:", error);
      message.error("Không thể tạo nguyên liệu. Vui lòng thử lại sau.");
    } finally {
      setIsCreatingIngredient(false);
    }
  };

  return (
    <MainLayout title="Tạo Nguyên Liệu">
      <Row justify="center" style={{ marginTop: "20px" }}>
        <Col span={18}>
          <Card
            title={<Title level={3}>Tạo Nguyên Liệu Mới</Title>}
            bordered={false}
          >
            <Form
              form={form}
              onFinish={handleCreateIngredient}
              layout="vertical"
            >
              <Form.Item
                label="Tên Nguyên Liệu"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên nguyên liệu!" },
                ]}
              >
                <Input placeholder="Nhập tên nguyên liệu" />
              </Form.Item>

              <Form.Item label="Calories (kcal)" name="calories">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập calories"
                />
              </Form.Item>
              <Form.Item label="Protein (g)" name="protein">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập protein"
                />
              </Form.Item>
              <Form.Item label="Carbs (g)" name="carbs">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập carbs"
                />
              </Form.Item>
              <Form.Item label="Fat (g)" name="fat">
                <InputNumber style={{ width: "100%" }} placeholder="Nhập fat" />
              </Form.Item>
              <Form.Item label="Weight (g)" name="weight">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập weight"
                />
              </Form.Item>
              <Form.Item label="Fiber (g)" name="fiber">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập fiber"
                />
              </Form.Item>
              <Form.Item label="Vitamin A (IU)" name="vitaminA">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập vitamin A"
                />
              </Form.Item>
              <Form.Item label="Vitamin B (mg)" name="vitaminB">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập vitamin B"
                />
              </Form.Item>
              <Form.Item label="Vitamin C (mg)" name="vitaminC">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập vitamin C"
                />
              </Form.Item>
              <Form.Item label="Vitamin D (IU)" name="vitaminD">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập vitamin D"
                />
              </Form.Item>
              <Form.Item label="Vitamin E (mg)" name="vitaminE">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập vitamin E"
                />
              </Form.Item>
              <Form.Item label="Calcium (mg)" name="calcium">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập calcium"
                />
              </Form.Item>
              <Form.Item label="Iron (mg)" name="iron">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập iron"
                />
              </Form.Item>
              <Form.Item label="Magnesium (mg)" name="magnesium">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập magnesium"
                />
              </Form.Item>
              <Form.Item label="Omega 3 (g)" name="omega3">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập omega 3"
                />
              </Form.Item>
              <Form.Item label="Sugars (g)" name="sugars">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập sugars"
                />
              </Form.Item>
              <Form.Item label="Cholesterol (mg)" name="cholesterol">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập cholesterol"
                />
              </Form.Item>
              <Form.Item label="Sodium (mg)" name="sodium">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập sodium"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isCreatingIngredient}
                >
                  Tạo Nguyên Liệu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default CreateIngredient;
