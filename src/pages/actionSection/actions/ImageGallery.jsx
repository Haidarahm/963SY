import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Thumbs,
  FreeMode,
  Autoplay,
} from "swiper/modules";
import { getMediaData } from "../../../api/media";
import "./ImageGallery.css";
import { useTranslation } from "react-i18next";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const ImageGallery = () => {
    const navigate=useNavigate()
  const { placeId } = useOutletContext();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const currentLanguage = localStorage.getItem("language_id");
  const categoryId = sessionStorage.getItem("category_place_id");
  const cityId = sessionStorage.getItem("city_place_id");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const data = await getMediaData(
          placeId,
          cityId,
          categoryId,
          currentLanguage
        );
        // Filter media to only include items with med_type === 1
        const filteredMedia = data.data
          ? data.data.filter((item) => item.med_type === 1)
          : [];
        setMedia(filteredMedia);
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };

    if (placeId && cityId && categoryId && currentLanguage) {
      fetchMedia();
    }
  }, [placeId, cityId, categoryId, currentLanguage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading images...</p>
        </div>
      </div>
    );
  }

  if (!media || media.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">
            {t("imageGallery.noImages", "No images available for this place.")}
          </p>
        </div>
      </div>
    );
  }
const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="image-gallery w-full max-w-6xl mx-auto px-4 py-8">
      <button onClick={handleBack} className="back-button">
        {t("common.back", "Back")}
      </button>
      <div className="mb-6">
        <Swiper
          style={{
            "--swiper-navigation-color": "#F26A1B",
            "--swiper-pagination-color": "#F26A1B",
          }}
          spaceBetween={10}
          navigation={true}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs, Pagination, Autoplay]}
          className="rounded-xl overflow-hidden shadow-2xl bg-white"
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
        >
          {media.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative group">
                <img
                  src={item.med_content}
                  alt={item.med_name || `Image ${index + 1}`}
                  className="w-full h-96 md:h-[500px] lg:h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Image overlay with title */}
                {item.med_name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
                    <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">
                      {item.med_name}
                    </h3>
                    <div className="flex items-center text-primary-300">
                      <span className="text-sm">
                        {index + 1} {t("imageGallery.of", "of")} {media.length}
                      </span>
                    </div>
                  </div>
                )}

                {/* Image counter for mobile */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {index + 1}/{media.length}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Swiper - Hidden on mobile for better UX */}
      {media.length > 1 && (
        <div className="hidden md:block">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            breakpoints={{
              640: {
                slidesPerView: 4,
              },
              768: {
                slidesPerView: 6,
              },
              1024: {
                slidesPerView: 8,
              },
              1280: {
                slidesPerView: 10,
              },
            }}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="rounded-lg overflow-hidden"
          >
            {media.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="cursor-pointer group">
                  <img
                    src={item.med_content}
                    alt={item.med_name || `Thumbnail ${index + 1}`}
                    className="w-full h-16 md:h-20 lg:h-24 object-cover rounded-lg transition-all duration-300 group-hover:opacity-75 group-hover:scale-95 border-2 border-transparent group-hover:border-primary-500"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
