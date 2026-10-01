import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // default dark
  const [isMobileView, setIsMobileView] = useState(false); // default desktop

  // Only toggled via button click
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleMobileView = () => setIsMobileView(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isMobileView, toggleMobileView }}>
      {children}
    </ThemeContext.Provider>
  );
};
