import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Culture.css';
import LazyImage from '../../../components/lazy/LazyImage';
import { useTranslation } from 'react-i18next';
import { fetchCategoriesByLanguage } from '../../../api/categories';
import { fetchPlacesByCategory } from '../../../api/places';
import { Spin } from 'antd';
import { useNavigate } from 'react-router';

const Culture = () => {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  const [culturePlaces, setCulturePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCulturePlaces = async () => {
      setLoading(true);
      try {
        // Get current language from localStorage
        const currentLanguage = localStorage.getItem('language_id');
        if (!currentLanguage) {
          throw new Error('Language ID not found in localStorage');
        }

        // Step 1: Fetch categories by language
        const categoriesResponse = await fetchCategoriesByLanguage(currentLanguage);

        // Step 2: Find the culture category (cat_type === 4)
        const cultureCategory = categoriesResponse.data.find(cat => cat.cat_type === 4);

        if (!cultureCategory) {
          throw new Error('No culture category (cat_type === 4) found');
        }

        // Step 3: Fetch places for the culture category
        const placesResponse = await fetchPlacesByCategory(
          cultureCategory.id,
          currentLanguage
        );

        if (placesResponse.data && placesResponse.data.length > 0) {
          setCulturePlaces(placesResponse.data);
        } else {
          setCulturePlaces([]);
          setError('No culture places found');
        }
      } catch (err) {
        console.error('Error fetching culture places:', err);
        setError(err.message || 'Failed to load culture places');
        setCulturePlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCulturePlaces();
  }, [i18n.language]); // Refetch when language changes

  const handleExploreClick = () => {
    const activePlace = culturePlaces[activeIndex];
    if (activePlace) {
      // Store IDs in sessionStorage for potential use in other components
      sessionStorage.setItem("category_place_id", activePlace.categories_idcategories);
      sessionStorage.setItem("city_place_id", activePlace.cities_idcities);

      // Navigate to action section with the appropriate IDs
      navigate(`/cities/${activePlace.categories_idcategories}/sites/${activePlace.cities_idcities}/action/${activePlace.id}`);
    }
  };

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  if (loading) {
    return (
      <section className="parallax-swiper" id="culture">
        <div className="loading-container">
          <Spin size="large" />
          <p>{t("culture.loading", "Loading culture places...")}</p>
        </div>
      </section>
    );
  }

  if (error || culturePlaces.length === 0) {
    return (
      <section className="parallax-swiper" id="culture">
        <div className="error-container">
          <p>{error || t("culture.noPlaces", "No culture places available")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="parallax-swiper" id="culture">
      <Swiper
        key={i18n.language}
        dir={isRTL ? "rtl" : "ltr"}
        speed={1000}
        parallax={true}
        effect={'fade'}
        navigation={false}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}">${culturePlaces[index]?.place_name || ''}</span>`;
          }
        }}
        modules={[Parallax, EffectFade, Navigation, Pagination]}
        className="mySwiper h-full"
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {culturePlaces.map((place, idx) => (
          <SwiperSlide key={place.id || idx}>
            <LazyImage
              src={place.photo || ''}
              alt={place.place_name || ''}
              className="parallax-bg"
              data-swiper-parallax="-30%"
            />
            <div className="parallax-content">
              <div className="title-container" data-swiper-parallax="-300">
                <h2 className="title">{place.place_name}</h2>
              </div>
              <div className="text" data-swiper-parallax="-100">
                <p>{place.description}</p>
                <button className="explore-btn" onClick={handleExploreClick}>
                  {t("culture.button")}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </section>
  );
};

export default Culture;




