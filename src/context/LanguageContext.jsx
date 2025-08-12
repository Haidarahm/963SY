// context/LanguageContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { fetchLanguages } from "../api/languages";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("English");

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await fetchLanguages();
        setLanguages(data.data);

        const storedLangCode = localStorage.getItem("language") || "en";
        const storedLang = data.data.find((lang) => lang.code === storedLangCode);

        if (storedLang) {
          applyLanguage(storedLang);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    loadLanguages();
  }, []);

  const applyLanguage = (lang) => {
    i18n.changeLanguage(lang.code);
    localStorage.setItem("language", lang.code);
    localStorage.setItem("language_id", lang.id);

    setCurrentLanguage(lang.name);
    document.documentElement.dir = lang.code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang.code;
  };

  const changeLanguage = (langId) => {
    const selectedLang = languages.find((lang) => lang.id === Number(langId));
    if (selectedLang) {
      applyLanguage(selectedLang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
