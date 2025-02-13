import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({
  theme: {
    background: '#FFFFFF',
    altBackground: '#F5F5F5',
    text: '#000000',
    button: '#FF6C00',
    filterText: '#000000',
    countryNameText: '#000000',
    detailLabelText: '#000000',
    capitalText: '#000000',
    searchBarText: '#000000',
    filterOptionText: '#000000',
    detailValueText: '#000000',
    modalText: '#000000',
    headerTitleText: '#000000',
    expandedSectionText: '#000000',
    isDark: false,
    toggleTheme: () => {},
  },
  language: 'en',
  setLanguage: (lang: string) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleTheme = () => setIsDark(!isDark);

  const theme = { 
    background: isDark ? '#000F24' : '#FFFFFF',
    altBackground: isDark ? '#1E2C41' : '#F2F4F7',
    searchBackground: isDark ? '#1E2C41' : '#F2F4F7',
    text: isDark ? '#FFFFFF' : '#000000',
    button: '#FF6C00',
    filterText: isDark ? '#D0D5DD' : '#000000',
    countryNameText: isDark ? '#F2F4F7' : '#1C1917',
    detailLabelText: isDark ? '#F2F4F7' : '#1C1917',
    capitalText: isDark ? '#98A2B3' : '#667085',
    searchBarText: '#EAECF0',
    filterOptionText: isDark ? '#D0D5DD' : '#667085',
    detailValueText: isDark ? '#F2F4F7' : '#1C1917',
    modalText: isDark ? '#F2F4F7' : '#1C1917',
    headerTitleText: isDark ? '#EAECF0' : '#1C1917',
    expandedSectionText: isDark ? '#F2F4F7' : '#1C1917',
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={{ theme, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);