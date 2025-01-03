import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get the theme from local storage or default to "light"
    return localStorage.getItem("appTheme") || "light";
  });

  useEffect(() => {
    // Store the current theme to local storage when it changes
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
