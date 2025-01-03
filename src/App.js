import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import CreateAccount from "./pages/CreateAccount";
import Dashboards from "./pages/Dashboards";
import UserDetail from "./pages/UserDetail";
import DishesManagement from "./pages/DishesManagement";
import NutritionCriteriaManagement from "./pages/NutritionCriteriaManagement";
import NutritionCriteriaDetail from "./pages/NutritionCriteriaDetail";
import DishDetail from "./pages/DishDetail";
import IngredientManagement from "./pages/IngredientManagement";
import IngredientDetail from "./pages/IngredientDetail";
import CreateNutritionCriteria from "./pages/CreateNutritionCriteria";
import CreateDish from "./pages/CreateDish";
import CreateIngredient from "./pages/CreateIngredient";
import OrdersManagement from "./pages/OrdersManagement";
import OrderDetail from "./pages/OrderDetail";
import ArticlesManagement from "./pages/ArticlesManagement";
import ArticleDetail from "./pages/ArticleDetail";
import CreateArticle from "./pages/CreateArticle";
import ArticleModerateManagement from "./pages/ArticleModerateManagement";
import UserActivityManagement from "./pages/UserActivityManagement";
import ModeratedArticles from "./pages/ModeratedArticles";
import ShippingManagement from "./pages/ShippingManagement";
import ShippingDetail from "./pages/ShippingDetail";
import InvalidWordManagement from "./pages/InvalidWordManagement";
// Hàm kiểm tra xác thực (JWT)
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Trả về true nếu có JWT
};

// Lấy role từ JWT
const getUserRole = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1])); // Giải mã payload từ JWT
  return payload.role; // Trả về vai trò từ payload
};

// Route bảo vệ (PrivateRoute)
const PrivateRoute = ({ children, roles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />; // Nếu chưa đăng nhập, chuyển về trang Login
  }

  const userRole = getUserRole();
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />; // Nếu vai trò không phù hợp, chuyển về trang Login
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang Login */}
        <Route path="/" element={<Login />} />

        {/* Trang dành cho Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["Admin"]}>
              <AdminPage />
            </PrivateRoute>
          }
        />

        {/* Trang quản lý tài khoản */}
        <Route
          path="/create-account"
          element={
            <PrivateRoute roles={["Admin"]}>
              <CreateAccount />
            </PrivateRoute>
          }
        />

        {/* Trang Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["Admin", "Staff"]}>
              <Dashboards />
            </PrivateRoute>
          }
        />

        {/* Các Routes khác */}
        <Route
          path="/userDetail/:id"
          element={
            <PrivateRoute roles={["Admin"]}>
              <UserDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/dishes-management"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <DishesManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/dish/:id"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <DishDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/nutritionCriteria-management"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <NutritionCriteriaManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/Ingredient-management"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <IngredientManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-nutritionCriteria"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <CreateNutritionCriteria />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-dish"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <CreateDish />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-ingredient"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <CreateIngredient />
            </PrivateRoute>
          }
        />

        <Route
          path="/nutritionCriteria-detail/:id"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <NutritionCriteriaDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/Ingredient-detail/:id"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <IngredientDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders-management"
          element={
            <PrivateRoute roles={["Admin", "Staff"]}>
              <OrdersManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipping-management"
          element={
            <PrivateRoute roles={["Admin", "Staff"]}>
              <ShippingManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/shipping-detail/:id"
          element={
            <PrivateRoute roles={["Admin", "Staff"]}>
              <ShippingDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-detail/:id"
          element={
            <PrivateRoute roles={["Admin", "Staff"]}>
              <OrderDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/articles-management"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <ArticlesManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/article-detail/:id"
          element={
            <PrivateRoute roles={["Admin", "Moderator", "Nutritionist"]}>
              <ArticleDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-article"
          element={
            <PrivateRoute roles={["Admin", "Nutritionist"]}>
              <CreateArticle />
            </PrivateRoute>
          }
        />

        <Route
          path="/articleModerate-management"
          element={
            <PrivateRoute roles={["Admin", "Moderator"]}>
              <ArticleModerateManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/invalidWord-management"
          element={
            <PrivateRoute roles={["Admin", "Moderator"]}>
              <InvalidWordManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/userActivity-management/:id"
          element={
            <PrivateRoute roles={["Admin"]}>
              <UserActivityManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/moderated-articles"
          element={
            <PrivateRoute roles={["Admin", "Moderator"]}>
              <ModeratedArticles />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
