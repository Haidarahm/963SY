import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  FaHotel,
  FaCoffee,
  FaUtensils,
  FaMonument,
  FaShoppingBag,
} from "react-icons/fa";
import LazyImage from "../../../components/lazy/LazyImage";
import i18n from "../../../locales/i18n";
import { useLanguage } from "../../../context/LanguageContext";
import './Services.css';
// Import AOS
import AOS from "aos";
import "aos/dist/aos.css";

// Import API service functions
import { fetchCategoriesByLanguage } from "../../../api/categories";
import { fetchCitiesByCategoryAndLanguage } from "../../../api/cities";
import { filterServices } from "../../../api/services";

const Services = () => {
  const navigate = useNavigate();
   const { languages, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { currentLanguage } = useLanguage();
  const languageId = localStorage.getItem("language_id");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default service icons and images as fallback

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);

        // Step 1: Fetch categories by language
        const categoriesResponse = await fetchCategoriesByLanguage(languageId);

        // Step 2: Find category with cat_type === 2 (Services)
        const servicesCategory = categoriesResponse.data.find(
          (cat) => cat.cat_type === 2
        );

        if (!servicesCategory) {
          console.error("No services category found");
          setLoading(false);
          return;
        }

        const servicesCategoryId = servicesCategory.id;

        // Step 3: Fetch cities for this category and language
        const citiesResponse = await fetchCitiesByCategoryAndLanguage(
          servicesCategoryId,
          languageId
        );

        if (citiesResponse.data && citiesResponse.data.length > 0) {
          // Step 4: Use the first city ID as default
          const defaultCityId = citiesResponse.data[0].id;

          // Step 5: Fetch services filtered by city, category, and language
          const servicesResponse = await filterServices(
            defaultCityId,
            servicesCategoryId,
            languageId
          );
          setServices(servicesResponse.data || []);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error loading services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (languageId) {
      loadServices();
    }
  }, [languageId, currentLanguage,languages]); // Depend on languageId and currentLanguage

  // Get service alt texts
  const getServiceAlt = (index) => {
    const defaultAlts = [
      t(
        "services.items.0.alt",
        "Traditional Syrian courtyard hotel with fountain"
      ),
      t(
        "services.items.1.alt",
        "Traditional Arabic coffee served in brass pot"
      ),
      t(
        "services.items.2.alt",
        "Spread of Syrian mezze dishes with hummus and kebabs"
      ),
      t(
        "services.items.3.alt",
        "Tour guide explaining Palmyra ruins to visitors"
      ),
      t("services.items.4.alt", "Vibrant Syrian souk with spices and textiles"),
    ];

    return index < defaultAlts.length ? defaultAlts[index] : "Service image";
  };

  // Map service type to appropriate icon

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  // Refresh AOS when loading state changes or services are loaded
  useEffect(() => {
    if (!loading && services.length > 0) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [loading, services]);

  return (
    <section className="services-section py-20" id="experiences">
      <div className="services-container max-w-6xl mx-auto px-5 flex flex-col">
        <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
          <h2 className="services-title relative text-4xl font-bold text-gray-800 mb-4">
            {t("services.sectionTitle")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100" data-aos-duration="800">
            {t("services.sectionDescription")}
          </p>
        </div>

        {loading ? (
          <div className="loading-spinner" data-aos="fade-in">
              <div className="spinner" />
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service, index) => {

                return (
                  <div
                    key={service.id}
                    className="service-card bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    data-aos-duration="800"
                    onClick={() => {
                      // Save relevant IDs to sessionStorage
                      sessionStorage.setItem(
                        "selected_language_id",
                        languageId
                      );
                      sessionStorage.setItem(
                        "selected_category_id",
                        service.categories_idcategories
                      );
                      sessionStorage.setItem(
                        "selected_city_id",
                        service.cities_idcities
                      );
                      // Navigate to service details page with service ID in params
                      navigate(`/services/${service.id}`);
                    }}
                  >
                    <div className="h-48 overflow-hidden">
                      <LazyImage
                        src={
                          service.ser_photo
                        }
                        alt={getServiceAlt(index)}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {service.ser_name}
                      </h3>
                      <p className="text-gray-600 mb-5">
                        {service.description}
                      </p>
                      <button
                        className={`text-[#f26a1b] font-medium flex items-center gap-2 group ${
                          isRTL ? "ltr" : ""
                        }`}
                      >

                        {t("services.button")}
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                );
              })
            ) : (
              <div className="col-span-full text-center py-8" data-aos="fade-in">
                <p className="text-gray-600">
                  {t(
                    "services.noServicesFound",
                    "No services found. Please check back later."
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;





