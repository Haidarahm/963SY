import React, { useEffect, useState } from "react";
import "./cities.css";
import { useNavigate, useParams } from "react-router";
import { Pagination, Skeleton, Spin } from "antd";
import { fetchCitiesByCategoryAndLanguage } from "../../api/cities";
import { showCategory } from "../../api/categories";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";

const Cities = () => {
  const { id: categoryId } = useParams(); // categoryId from URL
  const { currentLanguage: language } = useLanguage();
  const currentLanguage = localStorage.getItem("language_id"); // languageId from context
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transition, setTransition] = useState("");
  const [categoryName, setCategoryName] = useState(t("search.loading")); // Default name
  const [categoryDescription, setCategoryDescription] = useState(
    t("loadingCategoryInfo", "Please wait while we load category information")
  ); // Default description
  const [categoryPhoto, setCategoryPhoto] = useState(""); // For header background image
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;

  useEffect(() => {
    const loadCities = async () => {
      if (!categoryId || !currentLanguage) return;

      setLoading(true);
      try {
        localStorage.setItem("category_Id", categoryId);
        const data = await fetchCitiesByCategoryAndLanguage(
          categoryId,
          currentLanguage,
          pageSize,
          currentPage
        );
        setCities(data.data);
        setTotalItems(data.meta?.total || 0);

        // Fetch category details (name, description, photo)
        const categoryData = await showCategory(categoryId);
        if (categoryData.data) {
          // Set category name
          if (categoryData.data.cat_name) {
            setCategoryName(categoryData.data.cat_name);
          }

          // Set category description
          if (categoryData.data.description) {
            setCategoryDescription(categoryData.data.description);
          }

          // Set category photo for header background
          if (categoryData.data.cat_photo) {
            setCategoryPhoto(categoryData.data.cat_photo);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [categoryId, currentLanguage, language, currentPage]);

  const handlePageChange = (page) => {
    setTransition("fade-out");
    setTimeout(() => {
      setCurrentPage(page);
      setTransition("fade-in");
      setTimeout(() => setTransition(""), 300);
    }, 300);
  };

  return (
    <section className="cities section-container">
      <div className="header-container">
        <div
          className="header-image"
          style={categoryPhoto ? { backgroundImage: `url(${categoryPhoto})` } : {}}
        >
          <h1 className="header-title">{categoryName}</h1>
          <p className="header-subtitle hidden md:block">
            {categoryDescription}
          </p>
        </div>
      </div>

      <h2 className="section-title">{t("cities.featuredTitle")}</h2>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className={`cards-container ${transition}`}>
            {cities.map((city, index) => (
              <div
                key={city.id}
                className="card"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="card-image">
                  <img src={city.photo} alt={city.title} />
                </div>
                <div className="card-content">
                  <h3 className="city-title">{city.city_name}</h3>
                  <p className="city-description">{city.description}</p>
                  <button
                    onClick={() => {
                      sessionStorage.setItem("city_place_id", city.id);

                      navigate(`sites/${city.id}`);
                    }}
                    className="card-button"
                  >
                    {t("common.explore", "Explore")} {city.city_name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={pageSize}
            onChange={handlePageChange}
            className="pagination"
            showSizeChanger={false}
             direction={isRTL ? "rtl" : "ltr"}
          />
        </>
      )}
    </section>
  );
};

export default Cities;






