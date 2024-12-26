import React, { useState, useEffect } from "react";
import { Tabs, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout"; // Import layout tổng thể
import SearchBar from "../components/SearchBar";
import EnhancedTable from "../components/Table";

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Customer");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/users/alluser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let fetchedUsers = response.data;

        if (activeTab === "Customer") {
          fetchedUsers = fetchedUsers.filter(
            (user) => user.roleId === 3 && user.status === "active"
          );
        } else if (activeTab === "System") {
          fetchedUsers = fetchedUsers.filter(
            (user) =>
              [2, 5, 4].includes(user.roleId) && user.status === "active"
          );
        } else if (activeTab === "Banned") {
          fetchedUsers = fetchedUsers.filter(
            (user) => user.status === "inactive"
          );
        }

        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại!");
        navigate("/");
      }
    };

    fetchUsers();
  }, [activeTab, navigate]);

  // Lọc theo từ khóa tìm kiếm
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        (user.username?.toLowerCase() || "").includes(
          (searchTerm || "").toLowerCase()
        ) ||
        (user.phoneNumber?.toLowerCase() || "").includes(
          (searchTerm || "").toLowerCase()
        ) ||
        (user.email?.toLowerCase() || "").includes(
          (searchTerm || "").toLowerCase()
        )
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <MainLayout title="Quản lý người dùng">
      <Tabs
        defaultActiveKey="Customer"
        onChange={handleTabChange}
        items={[
          { label: "Khách hàng", key: "Customer" },
          { label: "Hệ thống", key: "System" },
          { label: "Bị cấm", key: "Banned" },
        ]}
      />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Button
        type="primary"
        style={{ marginBottom: "16px" }}
        onClick={() => navigate("/create-account")}
      >
        Thêm người dùng
      </Button>
      <EnhancedTable rows={filteredUsers} />
    </MainLayout>
  );
};

export default AdminPage;

// import React, { useEffect, useState } from "react";
// import {
//   Input,
//   Button,
//   Card,
//   Descriptions,
//   Image,
//   Table,
//   Space,
//   Modal,
//   Form,
//   InputNumber,
//   Select,
//   Typography,
//   Row,
//   Col,
//   Spin,
//   message,
//   Upload,
//   Tag, // Import Tag component from Ant Design
// } from "antd";
// import {
//   EditOutlined,
//   PlusOutlined,
//   RightOutlined,
//   LeftOutlined,
//   UploadOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import MainLayout from "../components/MainLayout";

// const { Option } = Select;
// const { TextArea } = Input;
// const { Title } = Typography;

// const CLOUD_NAME = "dpzzzifpa";
// const UPLOAD_PRESET = "vegetarian assistant";

// const DishDetail = () => {
//   const { id } = useParams();
//   const [dish, setDish] = useState(null);
//   const [nutrition, setNutrition] = useState({});
//   const [ingredients, setIngredients] = useState([]);
//   const [allIngredients, setAllIngredients] = useState([]);
//   const [filteredIngredients, setFilteredIngredients] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isAddingIngredient, setIsAddingIngredient] = useState(false);
//   const [fileList, setFileList] = useState([]);
//   // State to manage selected ingredients
//   const [selectedIngredients, setSelectedIngredients] = useState([]);
//   const [ingredientWeight, setIngredientWeight] = useState({}); // Use object to store weight per ingredient
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadingIngredient, setLoadingIngredient] = useState(false);
//   const [loadingRemoveIngredient, setLoadingRemoveIngredient] = useState(false);
//   const [showImage, setShowImage] = useState(true);
//   const navigate = useNavigate();

//   const [form] = Form.useForm();

//   const dishTypeOptions = [
//     "Món chính sáng",
//     "Món chính trưa",
//     "Món chính tối",
//     "Khai vị sáng",
//     "Khai vị trưa",
//     "Khai vị tối",
//     "Tráng miệng sáng",
//     "Tráng miệng trưa",
//     "Tráng miệng tối",
//     "Đồ uống",
//     "Canh",
//   ];

//   // Define the dietary preference options
//   const dietaryPreferenceOptions = [
//     { value: 1, label: "Vegan" },
//     { value: 2, label: "Lacto" },
//     { value: 3, label: "Ovo" },
//     { value: 4, label: "Lacto-Ovo" },
//     { value: 5, label: "Pescatarian" },
//   ];

//   // Fetch dish details and ingredients
//   useEffect(() => {
//     const fetchDishDetails = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem("authToken");
//         const [dishResponse, nutritionResponse, ingredientsResponse] =
//           await Promise.all([
//             axios.get(
//               `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/dishs/GetDishByID/${id}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             ),
//             axios.get(
//               `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Dish/dishs/calculateNutrition/${id}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             ),
//             axios.get(
//               `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/getIngredientByDishId/${id}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             ),
//           ]);

//         setDish(dishResponse.data);
//         setNutrition(nutritionResponse.data);
//         setFileList([
//           {
//             uid: "-1",
//             name: "image.png",
//             status: "done",
//             url: dishResponse.data.imageUrl,
//           },
//         ]);
//         const ingredientsDetails = await Promise.all(
//           ingredientsResponse.data.map(async (ingredient) => {
//             const ingredientDetailResponse = await axios.get(
//               `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/getIngredientByIngredientId/${ingredient.ingredientId}`,
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
//             return {
//               ...ingredientDetailResponse.data,
//               weight: ingredient.weight,
//             };
//           })
//         );

//         setIngredients(ingredientsDetails);
//       } catch (error) {
//         console.error("Error fetching dish details:", error);
//         message.error("Không thể tải thông tin món ăn.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDishDetails();
//   }, [id]);

//   // Fetch all ingredients for adding new ones
//   useEffect(() => {
//     const fetchAllIngredients = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await axios.get(
//           "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/allIngredient",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setAllIngredients(response.data);
//         setFilteredIngredients(response.data);
//       } catch (error) {
//         console.error("Error fetching all ingredients:", error);
//         message.error("Không thể tải danh sách nguyên liệu.");
//       }
//     };

//     fetchAllIngredients();
//   }, []);

//   const handleImageChange = ({ fileList }) => {
//     setFileList(fileList);
//   };
//   const uploadImageToCloudinary = async (file) => {
//     if (!file) return "";
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//         formData
//       );
//       return response.data.secure_url;
//     } catch (error) {
//       console.error("Lỗi khi upload ảnh:", error);
//       message.error("Không thể upload ảnh. Vui lòng thử lại.");
//       return "";
//     }
//   };

//   const handleUpdateDish = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       let imageUrl = dish.imageUrl;

//       if (fileList.length > 0) {
//         const file = fileList[0]?.originFileObj;
//         imageUrl = await uploadImageToCloudinary(file);
//       }

//       // Send dietaryPreferenceId instead of preferenceName
//       const updatedDish = {
//         ...dish,
//         imageUrl,
//         // Make sure dietaryPreferenceId is included in the payload
//       };

//       await axios.put(
//         `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/dishs/updateDishDetailByDishId`,
//         updatedDish,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       message.success("Cập nhật món ăn thành công!");
//       setIsEditing(false);
//       setDish(updatedDish);
//     } catch (error) {
//       console.error("Error updating dish:", error);
//       message.error("Không thể cập nhật món ăn.");
//     }
//   };

//   const handleAddIngredient = async () => {
//     if (selectedIngredients.length === 0) {
//       message.warning("Vui lòng chọn ít nhất một nguyên liệu.");
//       return;
//     }

//     try {
//       setLoadingIngredient(true);
//       const token = localStorage.getItem("authToken");
//       // Gọi API để thêm nhiều nguyên liệu
//       const addIngredientPromises = selectedIngredients.map(
//         async (ingredientId) => {
//           return axios.post(
//             `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Dish/addIngredient`,
//             {
//               dishId: id,
//               ingredientId: ingredientId,
//               weight: parseFloat(ingredientWeight[ingredientId] || 0),
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//         }
//       );

//       await Promise.all(addIngredientPromises);
//       message.success("Thêm nguyên liệu thành công!");
//       const nutritionResponse = await axios.get(
//         `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Dish/dishs/calculateNutrition/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNutrition(nutritionResponse.data);

//       const newIngredientsDetail = await Promise.all(
//         selectedIngredients.map(async (ingredientId) => {
//           const ingredientDetailResponse = await axios.get(
//             `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/ingredients/getIngredientByIngredientId/${ingredientId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           return {
//             ...ingredientDetailResponse.data,
//             weight: parseFloat(ingredientWeight[ingredientId] || 0),
//           };
//         })
//       );
//       setIngredients((prevIngredients) => [
//         ...prevIngredients,
//         ...newIngredientsDetail,
//       ]);

//       setIsAddingIngredient(false);
//       setSelectedIngredients([]); // Reset selected ingredients
//       setIngredientWeight({});
//     } catch (error) {
//       console.error("Error adding ingredients:", error);
//       message.error("Không thể thêm nguyên liệu.");
//     } finally {
//       setLoadingIngredient(false);
//     }
//   };
//   const handleSearchIngredient = (value) => {
//     const filtered = allIngredients.filter((ingredient) =>
//       ingredient.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredIngredients(filtered);
//   };
//   // Function to handle ingredient selection
//   const handleIngredientSelect = (value) => {
//     if (selectedIngredients.includes(value)) {
//       // If already selected, remove it
//       setSelectedIngredients(
//         selectedIngredients.filter((item) => item !== value)
//       );
//       const { [value]: removedWeight, ...restWeights } = ingredientWeight;
//       setIngredientWeight(restWeights);
//     } else {
//       // If not selected, add it
//       setSelectedIngredients([...selectedIngredients, value]);
//       setIngredientWeight((prevWeights) => ({
//         ...prevWeights,
//         [value]: 0,
//       }));
//     }
//   };
//   const handleRemoveSelectedIngredient = (ingredientId) => {
//     setSelectedIngredients(
//       selectedIngredients.filter((item) => item !== ingredientId)
//     );
//     const { [ingredientId]: removedWeight, ...restWeights } = ingredientWeight;
//     setIngredientWeight(restWeights);
//   };
//   const handleWeightChange = (ingredientId, value) => {
//     setIngredientWeight((prevWeights) => ({
//       ...prevWeights,
//       [ingredientId]: value,
//     }));
//   };
//   // Function to handle ingredient removal from table
//   const handleRemoveIngredient = async (ingredientId) => {
//     try {
//       setLoadingRemoveIngredient(true);
//       const token = localStorage.getItem("authToken");
//       await axios.delete(
//         `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Dish/dishs/removeIngredient/${id}/${ingredientId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       message.success("Xóa nguyên liệu thành công!");

//       const nutritionResponse = await axios.get(
//         `https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/Dish/dishs/calculateNutrition/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNutrition(nutritionResponse.data);
//       setIngredients(
//         ingredients.filter((item) => item.ingredientId !== ingredientId)
//       );
//     } catch (error) {
//       console.error("Error removing ingredient:", error);
//       message.error("Không thể xóa nguyên liệu.");
//     } finally {
//       setLoadingRemoveIngredient(false);
//     }
//   };

//   const ingredientColumns = [
//     {
//       title: "Tên nguyên liệu",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Khối lượng (g)",
//       dataIndex: "weight",
//       key: "weight",
//     },
//     {
//       title: "Hành động",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="link"
//             danger
//             loading={loadingRemoveIngredient}
//             onClick={() => handleRemoveIngredient(record.ingredientId)}
//           >
//             Xóa
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   if (isLoading) return <Spin tip="Đang tải chi tiết món ăn..." />;

//   const handleDietaryPreferenceChange = (value) => {
//     setDish((prev) => ({ ...prev, dietaryPreferenceId: value }));
//   };

//   return (
//     <MainLayout title="Chi tiết món ăn">
//       <Row gutter={24} style={{ transition: "all 0.3s ease-in-out" }}>
//         <Col
//           span={showImage ? 16 : 24}
//           style={{
//             transition: "all 0.3s ease-in-out",
//             paddingRight: showImage ? "20px" : "0px",
//           }}
//         >
//           <Card
//             title={
//               <>
//                 {dish.name}
//                 <Button
//                   type="link"
//                   icon={<EditOutlined />}
//                   onClick={() => setIsEditing((prev) => !prev)}
//                 >
//                   {isEditing ? "Hủy" : "Chỉnh sửa"}
//                 </Button>
//                 {isEditing && (
//                   <Button
//                     type="primary"
//                     onClick={handleUpdateDish}
//                     style={{ marginLeft: 10 }}
//                   >
//                     Lưu
//                   </Button>
//                 )}
//               </>
//             }
//           >
//             <Descriptions bordered column={1}>
//               <Descriptions.Item label="Tên món">
//                 {isEditing ? (
//                   <Input
//                     value={dish.name}
//                     onChange={(e) =>
//                       setDish((prev) => ({ ...prev, name: e.target.value }))
//                     }
//                   />
//                 ) : (
//                   dish.name
//                 )}
//               </Descriptions.Item>
//               <Descriptions.Item label="Loại món">
//                 {isEditing ? (
//                   <Select
//                     placeholder="Chọn loại món"
//                     value={dish.dishType}
//                     onChange={(value) =>
//                       setDish((prev) => ({ ...prev, dishType: value }))
//                     }
//                     style={{ width: "100%" }}
//                   >
//                     {dishTypeOptions.map((option) => (
//                       <Option key={option} value={option}>
//                         {option}
//                       </Option>
//                     ))}
//                   </Select>
//                 ) : (
//                   dish.dishType
//                 )}
//               </Descriptions.Item>
//               <Descriptions.Item label="Giá">
//                 {isEditing ? (
//                   <InputNumber
//                     value={dish.price}
//                     onChange={(value) =>
//                       setDish((prev) => ({ ...prev, price: value }))
//                     }
//                     parser={(value) => parseInt(value, 10)} // Đảm bảo giá trị là số nguyên
//                     formatter={(value) => `${value} VNĐ`}
//                     style={{ width: "100%" }}
//                   />
//                 ) : (
//                   `${dish.price?.toLocaleString()} VNĐ`
//                 )}
//               </Descriptions.Item>
//               <Descriptions.Item label="Trường phái ăn uống">
//                 {isEditing ? (
//                   <Select
//                     placeholder="Chọn trường phái ăn uống"
//                     value={dish.dietaryPreferenceId}
//                     onChange={handleDietaryPreferenceChange}
//                     style={{ width: "100%" }}
//                   >
//                     {dietaryPreferenceOptions.map((option) => (
//                       <Option key={option.value} value={option.value}>
//                         {option.label}
//                       </Option>
//                     ))}
//                   </Select>
//                 ) : (
//                   dish.preferenceName || "Không có thông tin"
//                 )}
//               </Descriptions.Item>
//               <Descriptions.Item label="Trạng thái">
//                 {isEditing ? (
//                   <Select
//                     value={dish.status}
//                     onChange={(value) =>
//                       setDish((prev) => ({ ...prev, status: value }))
//                     }
//                   >
//                     <Option value="active">Hoạt động</Option>
//                     <Option value="inactive">Không hoạt động</Option>
//                   </Select>
//                 ) : dish.status === "active" ? (
//                   "Hoạt động"
//                 ) : (
//                   "Không hoạt động"
//                 )}
//               </Descriptions.Item>
//               <Descriptions.Item label="Mô tả">
//                 {isEditing ? (
//                   <TextArea
//                     value={dish.description}
//                     onChange={(e) =>
//                       setDish((prev) => ({
//                         ...prev,
//                         description: e.target.value,
//                       }))
//                     }
//                   />
//                 ) : (
//                   dish.description || "Không có mô tả"
//                 )}
//               </Descriptions.Item>
//               <Descriptions.Item label="Công thức">
//                 {isEditing ? (
//                   <TextArea
//                     value={dish.recipe}
//                     onChange={(e) =>
//                       setDish((prev) => ({ ...prev, recipe: e.target.value }))
//                     }
//                   />
//                 ) : (
//                   dish.recipe || "Không có công thức"
//                 )}
//               </Descriptions.Item>
//               <Descriptions.Item label="Calories">
//                 {nutrition.totalCalories || "Không có dữ liệu"} kcal
//               </Descriptions.Item>
//               <Descriptions.Item label="Protein">
//                 {nutrition.totalProtein || "Không có dữ liệu"} g
//               </Descriptions.Item>
//               <Descriptions.Item label="Carbs">
//                 {nutrition.totalCarbs || "Không có dữ liệu"} g
//               </Descriptions.Item>
//               <Descriptions.Item label="Fat">
//                 {nutrition.totalFat || "Không có dữ liệu"} g
//               </Descriptions.Item>
//               <Descriptions.Item label="Fiber">
//                 {nutrition.totalFiber || "Không có dữ liệu"} g
//               </Descriptions.Item>
//               <Descriptions.Item label="Sodium">
//                 {nutrition.totalSodium || "Không có dữ liệu"} mg
//               </Descriptions.Item>
//               {isEditing && (
//                 <Descriptions.Item label="Ảnh món ăn">
//                   <Upload
//                     fileList={fileList}
//                     onChange={handleImageChange}
//                     beforeUpload={() => false}
//                     listType="picture"
//                   >
//                     <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
//                   </Upload>
//                 </Descriptions.Item>
//               )}
//             </Descriptions>
//           </Card>
//         </Col>
//         {showImage && (
//           <Col
//             span={8}
//             style={{
//               transition: "all 0.3s ease-in-out",
//               maxHeight: "100%",
//               overflowY: "hidden",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "flex-start",
//             }}
//           >
//             <Button
//               type="default"
//               onClick={() => setShowImage(false)}
//               style={{ marginBottom: 16, alignSelf: "flex-end" }}
//               icon={<RightOutlined />}
//             >
//               Ẩn ảnh
//             </Button>
//             <Image
//               src={dish.imageUrl}
//               alt={dish.name}
//               style={{ width: "100%", height: "auto" }}
//             />
//           </Col>
//         )}
//         {!showImage && (
//           <Button
//             type="default"
//             onClick={() => setShowImage(true)}
//             style={{ position: "absolute", right: 30, top: 95 }}
//             icon={<LeftOutlined />}
//           >
//             Hiện ảnh
//           </Button>
//         )}
//       </Row>
//       <Card title="Nguyên liệu" style={{ marginTop: 24 }}>
//         <Table
//           dataSource={ingredients}
//           columns={ingredientColumns}
//           rowKey="ingredientId"
//           pagination={false}
//         />
//         <Button
//           type="dashed"
//           icon={<PlusOutlined />}
//           onClick={() => setIsAddingIngredient(true)}
//           style={{ marginTop: 16 }}
//         >
//           Thêm nguyên liệu
//         </Button>
//       </Card>
//       <Modal
//         visible={isAddingIngredient}
//         title="Thêm nguyên liệu mới"
//         onCancel={() => setIsAddingIngredient(false)}
//         onOk={handleAddIngredient}
//         confirmLoading={loadingIngredient}
//       >
//         {/* Display selected ingredients as tags */}
//         <div style={{ marginBottom: 16 }}>
//           {selectedIngredients.map((ingredientId) => {
//             const selectedIngredient = allIngredients.find(
//               (item) => item.ingredientId === ingredientId
//             );
//             return selectedIngredient ? (
//               <Tag
//                 key={ingredientId}
//                 closable
//                 onClose={() => handleRemoveSelectedIngredient(ingredientId)}
//               >
//                 {selectedIngredient.name}
//                 <InputNumber
//                   style={{ width: 100, marginLeft: 8 }}
//                   size="small"
//                   min={0}
//                   value={ingredientWeight[ingredientId] || 0}
//                   onChange={(value) => handleWeightChange(ingredientId, value)}
//                 />
//                 g
//               </Tag>
//             ) : null;
//           })}
//         </div>
//         <Form layout="vertical">
//           <Form.Item label="Nguyên liệu">
//             <Select
//               showSearch
//               placeholder="Tìm kiếm nguyên liệu"
//               onChange={handleIngredientSelect}
//               onSearch={handleSearchIngredient}
//               filterOption={false}
//               value={null}
//             >
//               {filteredIngredients.map((ingredient) => (
//                 <Option
//                   key={ingredient.ingredientId}
//                   value={ingredient.ingredientId}
//                   disabled={selectedIngredients.includes(
//                     ingredient.ingredientId
//                   )}
//                 >
//                   {ingredient.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </MainLayout>
//   );
// };

// export default DishDetail;
