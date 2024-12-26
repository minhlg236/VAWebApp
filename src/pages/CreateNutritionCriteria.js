import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateNutritionCriteria.css"; // Ensure you create a CSS file for styling
import axios from "axios";

const CreateNutritionCriteria = () => {
  const [formData, setFormData] = useState({
    gender: "",
    ageRange: "",
    bmiRange: "",
    profession: "0", // Always set to "0"
    activityLevel: "",
    goal: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    vitaminA: "",
    vitaminB: "",
    vitaminC: "",
    vitaminD: "",
    vitaminE: "",
    calcium: "",
    iron: "",
    magnesium: "",
    omega3: "",
    sugars: "",
    cholesterol: "",
    sodium: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateNutritionCriteria = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://vegetariansassistant-behjaxfhfkeqhbhk.southeastasia-01.azurewebsites.net/api/v1/nutritionCriterions/createNutritionCriteria",
        {
          ...formData,
          calories: parseFloat(formData.calories || 0),
          protein: parseFloat(formData.protein || 0),
          carbs: parseFloat(formData.carbs || 0),
          fat: parseFloat(formData.fat || 0),
          fiber: parseFloat(formData.fiber || 0),
          vitaminA: parseFloat(formData.vitaminA || 0),
          vitaminB: parseFloat(formData.vitaminB || 0),
          vitaminC: parseFloat(formData.vitaminC || 0),
          vitaminD: parseFloat(formData.vitaminD || 0),
          vitaminE: parseFloat(formData.vitaminE || 0),
          calcium: parseFloat(formData.calcium || 0),
          iron: parseFloat(formData.iron || 0),
          magnesium: parseFloat(formData.magnesium || 0),
          omega3: parseFloat(formData.omega3 || 0),
          sugars: parseFloat(formData.sugars || 0),
          cholesterol: parseFloat(formData.cholesterol || 0),
          sodium: parseFloat(formData.sodium || 0),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Nutrition criteria created successfully!");
        navigate("/nutritionCriteria-management");
      }
    } catch (error) {
      console.error("Error creating nutrition criteria:", error);
      alert("Failed to create nutrition criteria. Please try again.");
    }
  };

  return (
    <div className="create-nutrition-container">
      <h2>Create New Nutrition Criteria</h2>
      <form onSubmit={handleCreateNutritionCriteria}>
        <div className="nutrition-input-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div className="nutrition-input-group">
          <label htmlFor="ageRange">Age Range</label>
          <input
            type="text"
            id="ageRange"
            name="ageRange"
            value={formData.ageRange}
            onChange={handleChange}
            placeholder="Enter age range"
            required
          />
        </div>
        <div className="nutrition-input-group">
          <label htmlFor="bmiRange">BMI Range</label>
          <input
            type="text"
            id="bmiRange"
            name="bmiRange"
            value={formData.bmiRange}
            onChange={handleChange}
            placeholder="Enter BMI range"
            required
          />
        </div>
        <div className="nutrition-input-group">
          <label htmlFor="activityLevel">Activity Level</label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select Activity Level</option>
            <option value="Cao">Cao</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Ít">Ít</option>
          </select>
        </div>
        <div className="nutrition-input-group">
          <label htmlFor="goal">Goal</label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
          >
            <option value="">Select Goal</option>
            <option value="Tăng cân">Tăng cân</option>
            <option value="Giữ nguyên">Giữ nguyên</option>
            <option value="Giảm cân">Giảm cân</option>
          </select>
        </div>
        {[
          "calories",
          "protein",
          "carbs",
          "fat",
          "fiber",
          "vitaminA",
          "vitaminB",
          "vitaminC",
          "vitaminD",
          "vitaminE",
          "calcium",
          "iron",
          "magnesium",
          "omega3",
          "sugars",
          "cholesterol",
          "sodium",
        ].map((key) => (
          <div className="nutrition-input-group" key={key}>
            <label htmlFor={key}>
              {key.replace(/([A-Z])/g, " $1").toUpperCase()}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
        <div className="nutrition-create-button">
          <button type="submit">Create Nutrition Criteria</button>
        </div>
      </form>
    </div>
  );
};

export default CreateNutritionCriteria;
