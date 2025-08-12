import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/LanguageContext";
import { fetchCategoriesByLanguage } from "../../../api/categories";
import LazyImage from "../../../components/lazy/LazyImage";
import { Spin } from "antd";
import i18n from "../../../locales/i18n";
import AOS from "aos";
import "aos/dist/aos.css";
import "./destination.css";

const Destination = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const isRTL = i18n.language === "ar";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const languageId = localStorage.getItem("language_id");
        if (languageId) {
          const response = await fetchCategoriesByLanguage(languageId);
          // Filter categories to only include those with cat_type === 1
          const filteredCategories = response.data.filter(
            (category) => category.cat_type === 1
          );
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [currentLanguage]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  // Refresh AOS when loading state changes or categories are loaded
  useEffect(() => {
    if (!loading && categories.length > 0) {
      AOS.refresh();
    }
  }, [loading, categories]);

  return (
    <section className="destination-section" id="destinations">
      <div className="destination-container">
        <div className="destination-header" data-aos="fade-up">
          <h2 className="destination-title">{t("destinations.title")}</h2>
          <p className="destination-subtitle">{t("destinations.subtitle")}</p>
        </div>

        {loading ? (
          <div className="text-center">
            <Spin />
          </div>
        ) : (
          <div className="destination-grid">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="destination-card"
                data-aos="fade-up"
                data-aos-delay={index * 200}
                onClick={() => {
                  sessionStorage.setItem("category_place_id", category.id);
                  navigate(`/cities/${category.id}`);
                }}
              >
                <div className="destination-card-image-container">
                  <LazyImage
                    src={category.cat_photo}
                    alt={category.cat_name}
                    className="destination-card-image"
                  />
                </div>
                <div className="destination-card-content">
                  <h3 className="destination-card-title">
                    {category.cat_name}
                  </h3>
                  <p className="destination-card-description">
                    {category.description}
                  </p>
                  <button
                    className={`destination-button ${isRTL ? "ltr" : ""}`}
                  >
                    {t("destinations.button")}
                    <svg
                      className="destination-button-icon"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Destination;
