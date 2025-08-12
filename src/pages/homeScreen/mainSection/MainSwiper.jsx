import React, { forwardRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { fetchCategoriesByLanguage } from "../../../api/categories";
import { fetchPlacesByCategory } from "../../../api/places";
import "./MainSwiper.css";

const MainSwiper = forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const currentLanguage = localStorage.getItem("language_id");

  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const fetchFeaturedPlaces = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Get categories for current language
      const categoriesResponse = await fetchCategoriesByLanguage(currentLanguage);

      // Step 2: Find the featured category (cat_type === 3)
      const featuredCategory = categoriesResponse.data.find(cat => cat.cat_type === 3);

      if (!featuredCategory) {
        console.warn("No featured category (cat_type === 3) found");
        setFeaturedPlaces([]);
        setLoading(false);
        return;
      }

      // Step 3: Get places for the featured category using fetchPlacesByCategory
      const placesResponse = await fetchPlacesByCategory(
        featuredCategory.id,
        currentLanguage
      );

      if (placesResponse.data && placesResponse.data.length > 0) {
        setFeaturedPlaces(placesResponse.data);
        setError(null);
        setRetryCount(0); // Reset retry count on success
      } else {
        setFeaturedPlaces([]);
        // Don't set error here to allow retries for empty data
        throw new Error("No featured places found");
      }
    } catch (err) {
      console.error("Error fetching featured places:", err);

      // Increment retry count
      setRetryCount(prevCount => prevCount + 1);

      if (retryCount >= MAX_RETRIES - 1) {
        // If we've reached max retries, show the error
        setError(t("mainSwiper.error", "Failed to load featured places"));
      }
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, t, retryCount]);

  useEffect(() => {
    fetchFeaturedPlaces();
  }, [fetchFeaturedPlaces]);

  // Effect for retrying
  useEffect(() => {
    // If there was an error and we haven't exceeded max retries
    if (retryCount > 0 && retryCount < MAX_RETRIES) {
      const retryTimeout = setTimeout(() => {
        console.log(`Retrying fetch (${retryCount}/${MAX_RETRIES})...`);
        fetchFeaturedPlaces();
      }, 2000); // Wait 2 seconds before retrying

      return () => clearTimeout(retryTimeout);
    }
  }, [retryCount, fetchFeaturedPlaces]);

  const handlePlaceClick = (place) => {
    if (place.categories_idcategories && place.cities_idcities) {
      // Store IDs in sessionStorage
      sessionStorage.setItem("category_place_id", place.categories_idcategories);
      sessionStorage.setItem("city_place_id", place.cities_idcities);

      // Navigate to action section
      navigate(`/cities/${place.categories_idcategories}/sites/${place.cities_idcities}/action/${place.id}`);
    }
  };

  if (loading ) {
    return (
      <div className="swiper-content loading" ref={ref}>
        {retryCount > 0 ?
          t("mainSwiper.retrying", "Retrying to load featured places... ({{current}}/{{max}})",
            { current: retryCount, max: MAX_RETRIES }) :
          t("mainSwiper.loading", "Loading featured places...")}
      </div>
    );
  }

  if (error || featuredPlaces.length === 0) {
    return <div className="swiper-content error" ref={ref}>{error || t("mainSwiper.noPlaces", "No featured places available")}</div>;
  }

  return (
    <div className="swiper-content" ref={ref}>
      <Swiper
        key={i18n.language} // Force reinitialization on language change
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={featuredPlaces.length > 1}
        dir={isRTL ? "rtl" : "ltr"}
        className="featured-sites-swiper"
        {...props}
      >
        {featuredPlaces.map((place) => (
          <SwiperSlide key={place.id}>
            <div className="swiper-slide-content" onClick={() => handlePlaceClick(place)}>
              <img
                src={place.photo}
                alt={place.place_name}
                className="slide-image"
              />
              <div className="slide-overlay"></div>
              <div className="slide-caption">
                <h3>{place.place_name}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

MainSwiper.displayName = "MainSwiper";

export default MainSwiper;



