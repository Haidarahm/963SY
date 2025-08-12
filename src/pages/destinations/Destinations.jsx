import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";
import {
  FaMosque,
  FaLandmark,
  FaMountain,
  FaUmbrellaBeach
} from "react-icons/fa";
import { fetchCategoriesByLanguage } from "../../api/categories";
import { useLanguage } from "../../context/LanguageContext";
import LazyImage from "../../components/lazy/LazyImage";
import i18n from "../../locales/i18n";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Destinations.css";

// Map of icons to use based on category type or other properties
const iconMap = {
  mosque: <FaMosque className="destination-icon" />,
  landmark: <FaLandmark className="destination-icon" />,
  mountain: <FaMountain className="destination-icon" />,
  beach: <FaUmbrellaBeach className="destination-icon" />,
};

// Function to determine which icon to use based on category index or properties
const getCategoryIcon = (index, category) => {
  const iconKeys = Object.keys(iconMap);
  // Use category properties if available, otherwise use index to cycle through icons
  return iconMap[iconKeys[index % iconKeys.length]];
};

const Destinations = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinationCategories = async () => {
      setLoading(true);
      try {
        // Get current language from localStorage
        const languageId = localStorage.getItem('language_id');
        if (!languageId) {
          throw new Error('Language ID not found in localStorage');
        }

        // Fetch categories by language
        const categoriesResponse = await fetchCategoriesByLanguage(languageId);

        // Filter categories to only include those with cat_type === 1 (destinations)
        const destinationCategories = categoriesResponse.data.filter(
          (category) => category.cat_type === 1
        );

        if (destinationCategories.length > 0) {
          setCategories(destinationCategories);
          setError(null);
        } else {
          setCategories([]);
          setError('No destination categories found');
        }
      } catch (err) {
        console.error('Error fetching destination categories:', err);
        setError(err.message || 'Failed to load destination categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationCategories();
  }, [currentLanguage]); // Refetch when language changes

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  // Handle navigation to cities page with the selected category
  const handleExplore = (categoryId) => {
    sessionStorage.setItem("category_place_id", categoryId);
    navigate(`/cities/${categoryId}`);
  };

  return (
    <section className="destinations-section" id="destinations">
      <div className="section-header">
        <h2>{t("destinationsSite.title")}</h2>
        <p>{t("destinationsSite.subtitle")}</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="destinations-grid">
          {categories.map((category, index) => (
            <div
              className="destination-card"
              key={category.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
             <img className="card-image" src={category.cat_photo} alt="" />
              <div className="card-content">
                <div className="card-header">
                  {getCategoryIcon(index, category)}
                  <h3>{category.cat_name}</h3>
                </div>
                <p className="card-description">
                  {category.description || t("destinationsSite.defaultDescription")}
                </p>
                <button
                  className="explore-btn"
                  onClick={() => handleExplore(category.id)}
                >
                  {t("destinationsSite.button")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Destinations;

