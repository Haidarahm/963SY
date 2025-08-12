import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./GallerySection.css";
import { useTranslation } from "react-i18next";
import { fetchCategoriesByLanguage } from "../../../api/categories";
import { fetchPlacesByCategory } from "../../../api/places";
import { Spin } from "antd";
import { useNavigate } from "react-router";
import LazyImage from "../../../components/lazy/LazyImage";

const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [galleryPlaces, setGalleryPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentLanguage = localStorage.getItem("language_id");

  useEffect(() => {
    const fetchGalleryPlaces = async () => {
      setLoading(true);
      try {
        // Get current language from localStorage
        if (!currentLanguage) {
          throw new Error("Language ID not found in localStorage");
        }

        // Step 1: Fetch categories by language
        const categoriesResponse = await fetchCategoriesByLanguage(
          currentLanguage
        );

        // Step 2: Find the gallery category (cat_type === 5)
        const galleryCategory = categoriesResponse.data.find(
          (cat) => cat.cat_type === 5
        );

        if (!galleryCategory) {
          throw new Error("No gallery category (cat_type === 5) found");
        }

        // Step 3: Fetch places for the gallery category
        const placesResponse = await fetchPlacesByCategory(
          galleryCategory.id,
          currentLanguage
        );
        if (placesResponse.data && placesResponse.data.length > 0) {
          setGalleryPlaces(placesResponse.data);
        } else {
          setGalleryPlaces([]);
          setError("No gallery places found");
        }
      } catch (err) {
        console.error("Error fetching gallery places:", err);
        setError(err.message || "Failed to load gallery places");
        setGalleryPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryPlaces();
  }, [i18n.language, currentLanguage, t]); // Refetch when language changes

  const handleExploreClick = () => {
    const activePlace = galleryPlaces[activeIndex];
    if (activePlace) {
      // Store IDs in sessionStorage for potential use in other components
      sessionStorage.setItem(
        "category_place_id",
        activePlace.categories_idcategories
      );
      sessionStorage.setItem("city_place_id", activePlace.cities_idcities);

      // Navigate to action section with the appropriate IDs
      navigate(
        `/cities/${activePlace.categories_idcategories}/sites/${activePlace.cities_idcities}/action/${activePlace.id}`
      );
    }
  };

  if (loading) {
    return (
      <section className="gallery-section">
        <h2 className="gallery-title">{t("gallerySection.title")}</h2>
        <div className="loading-container">
          <Spin size="large" />
          <p>Loading gallery places...</p>
        </div>
      </section>
    );
  }

  if (error || galleryPlaces.length === 0) {
    return (
      <section className="gallery-section">
        <h2 className="gallery-title">{t("gallerySection.title")}</h2>
        <div className="error-container">
          <p>{error || "No gallery places available"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section">
      <h2 className="gallery-title">{t("gallerySection.title")}</h2>
      <div className="content-container">
        {/* Left Content */}
        <div
          className={`text-content text-center ${
            isRTL ? "md:text-right" : "md:text-left"
          }`}
        >
          <span className="section-label">{t("gallerySection.label")}</span>
          <h2
            className={`section-title ${
              isRTL ? "md:text-right" : "md:text-left"
            }`}
          >
            {galleryPlaces[activeIndex]?.place_name}
          </h2>
          <p
            className={`section-description ${
              isRTL ? "md:text-right" : "md:text-left"
            }`}
          >
            {galleryPlaces[activeIndex]?.description}
          </p>
          <button className="explore-button" onClick={handleExploreClick}>
            {t("gallerySection.exploreButton")}
          </button>
        </div>

        {/* Right Swiper */}
        <div className="swiper-container">
          <Swiper
            key={i18n.language} // Force re-render on language change
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination]}
            className="destination-swiper"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            initialSlide={0}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {galleryPlaces.map((place, index) => (
              <SwiperSlide key={place.id || index}>
                <div className="slide-image-container">
                  <LazyImage
                    src={place.photo}
                    alt={place.place_name}
                    className="slide-image"
                  />

                  <div className="image-overlay"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
