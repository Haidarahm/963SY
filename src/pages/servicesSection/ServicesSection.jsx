/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Pagination, Select } from "antd";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaStar, FaLocationArrow } from "react-icons/fa";
import "./servicesSection.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import LazyImage from "../../components/lazy/LazyImage";
import { fetchCitiesByCategoryAndLanguage } from "../../api/cities";
import { filterServices } from "../../api/services";
import {
  filterPlaceByService,
  filterPlaceByServiceAndStar,
} from "../../api/places";
import { fetchStarsByCategory } from "../../api/stars";
import AOS from "aos";
import "aos/dist/aos.css";
import { getLocationData } from "../../api/location";
import { useNavigate, useParams } from "react-router";

// Import the new components
import ServicesSidebar from "./ServicesSidebar";
import StarRatingFilter from "./StarRatingFilter";

const ServicesSection = () => {
  const { serviceId } = useParams();

  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [activeService, setActiveService] = useState(serviceId || null);
  const [activeCity, setActiveCity] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [cities, setCities] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [starFilter, setStarFilter] = useState(0);
  const [availableStars, setAvailableStars] = useState([]);
  const [showStarFilter, setShowStarFilter] = useState(false);
  const pendingRequestsRef = useRef(0);
  const [placeLocations, setPlaceLocations] = useState({});
  const [loadingButtons, setLoadingButtons] = useState({});
  const navigate = useNavigate();

  // Add a ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Add a ref to track the service button that should be clicked
  const serviceButtonRef = useRef(null);

  const pageSize = 6;

  // Helper function to manage loading state
  const withLoading = async (asyncFunction) => {
    try {
      // Increment pending requests counter
      pendingRequestsRef.current += 1;

      // Set loading to true if this is the first pending request
      if (pendingRequestsRef.current === 1) {
        setLoading(true);
      }

      // Execute the async function
      return await asyncFunction();
    } finally {
      // Decrement pending requests counter
      pendingRequestsRef.current -= 1;

      // Set loading to false if there are no more pending requests
      if (pendingRequestsRef.current === 0) {
        setLoading(false);
      }
    }
  };

  // Get category and language IDs from sessionStorage
  const getCategoryAndLanguageIds = () => {
    const categoryId = sessionStorage.getItem("selected_category_id");
    const languageId = sessionStorage.getItem("selected_language_id");
    return { categoryId, languageId };
  };

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      await withLoading(async () => {
        try {
          const { categoryId, languageId } = getCategoryAndLanguageIds();

          if (categoryId && languageId) {
            const citiesData = await fetchCitiesByCategoryAndLanguage(
              categoryId,
              languageId
            );

            if (citiesData && citiesData.data && citiesData.data.length > 0) {
              const formattedCities = citiesData.data.map((city) => ({
                id: city.idcities || city.id,
                name:
                  city.city_name.charAt(0).toUpperCase() +
                  city.city_name.slice(1),
              }));

              setCities(formattedCities);

              // Set the first city as default active city
              if (formattedCities.length > 0) {
                setActiveCity(formattedCities[0].id);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      });
    };

    fetchCities();
  }, []);

  // Fetch service categories and set serviceId as default if available
  useEffect(() => {
    const fetchServiceCategories = async () => {
      await withLoading(async () => {
        try {
          const { categoryId, languageId } = getCategoryAndLanguageIds();
          const cityId = activeCity;

          if (categoryId && languageId && cityId) {
            const servicesData = await filterServices(
              cityId,
              categoryId,
              languageId
            );

            if (servicesData && servicesData.data) {
              const formattedServices = servicesData.data.map((service) => ({
                id: service.id || service.idservices,
                name: service.ser_name,
                type: service.ser_type,
                description: service.description,
              }));

              setServiceCategories(formattedServices);

              // Check if serviceId from URL params exists in the fetched services
              if (serviceId && isFirstRender.current) {
                const normalizedServiceId = parseInt(serviceId) || serviceId;
                const serviceExists = formattedServices.some(
                  (service) =>
                    service.id === normalizedServiceId ||
                    service.id === parseInt(serviceId) ||
                    service.id === serviceId
                );

                if (serviceExists) {
                  // If serviceId exists, set it as active service
                  setActiveService(normalizedServiceId);
                  isFirstRender.current = false;

                  // Store the serviceId to reference the button later
                  serviceButtonRef.current = normalizedServiceId;
                } else if (formattedServices.length > 0) {
                  // If serviceId doesn't exist but we have services, set first one as active
                  setActiveService(formattedServices[0].id);
                  isFirstRender.current = false;
                }
              } else {
                // If no serviceId or not first render, use normal logic
                const currentServiceExists = formattedServices.some(
                  (service) => service.id === activeService
                );

                if (formattedServices.length > 0) {
                  if (activeService === null || !currentServiceExists) {
                    setActiveService(formattedServices[0].id);
                  }
                } else {
                  setActiveService(null);
                  setPlaces([]);
                  setTotalItems(0);
                }
              }
            } else {
              setServiceCategories([]);
              setActiveService(null);
              setPlaces([]);
              setTotalItems(0);
            }
          }
        } catch (error) {
          console.error("Error fetching service categories:", error);
          setServiceCategories([]);
          setActiveService(null);
          setPlaces([]);
          setTotalItems(0);
        }
      });
    };

    if (activeCity) {
      fetchServiceCategories();
    }
  }, [activeCity, serviceId]);

  // Handle URL parameter changes to sync activeService state
  useEffect(() => {
    if (serviceId && serviceCategories.length > 0) {
      const normalizedServiceId = parseInt(serviceId) || serviceId;
      const serviceExists = serviceCategories.some(
        (service) => service.id === normalizedServiceId
      );

      if (serviceExists && activeService !== normalizedServiceId) {
        setActiveService(normalizedServiceId);
      }
    }
  }, [serviceId, serviceCategories, activeService]);

  // Add a new useEffect to scroll to the active service button after services are loaded
  useEffect(() => {
    // Only run this effect if we have service categories and an active service
    if (serviceCategories.length > 0 && activeService) {
      // Find the button element for the active service
      const activeButton = document.querySelector(
        `[data-service-id="${activeService}"]`
      );

      if (activeButton) {
        // Scroll the button into view with smooth behavior
        activeButton.scrollIntoView({ behavior: "smooth", block: "center" });

        // Add a subtle highlight animation
        activeButton.classList.add("pulse-highlight");

        // Remove the animation class after it completes
        setTimeout(() => {
          activeButton.classList.remove("pulse-highlight");
        }, 1000);
      }
    }
  }, [serviceCategories, activeService]);

  // Fetch available stars for the selected service and city
  const fetchAvailableStars = async () => {
    if (!activeCity || !activeService) return;

    await withLoading(async () => {
      try {
        const { categoryId, languageId } = getCategoryAndLanguageIds();

        const starsData = await fetchStarsByCategory(
          categoryId,
          languageId,
          activeService,
          activeCity
        );

        if (starsData && starsData.data && starsData.data.length > 0) {
          // Map the response to extract id and number
          const stars = starsData.data.map((item) => ({
            id: item.id,
            number: item.number,
          }));

          // Sort by number for display order
          stars.sort((a, b) => a.number - b.number);

          setAvailableStars(stars);
        } else {
          setAvailableStars([]);
        }
      } catch (error) {
        console.error("Error fetching available stars:", error);
        setAvailableStars([]);
      }
    });
  };

  // Fetch places for the selected service
  const fetchPlacesForService = async (page = 1) => {
    await withLoading(async () => {
      try {
        const { categoryId, languageId } = getCategoryAndLanguageIds();
        const cityId = activeCity;

        if (categoryId && languageId && activeService && cityId) {
          let placesData;

          // If starFilter is 0 (All), use filterPlaceByService
          if (starFilter === 0) {
            placesData = await filterPlaceByService(
              cityId,
              categoryId,
              languageId,
              activeService,
              pageSize,
              page
            );
          } else {
            // Otherwise, use filterPlaceByServiceAndStar with the selected star ID
            placesData = await filterPlaceByServiceAndStar(
              cityId,
              categoryId,
              languageId,
              activeService,
              starFilter,
              pageSize,
              page
            );
          }

          if (placesData && placesData.data) {
            const formattedPlaces = placesData.data.map((place) => ({
              id: place.id,
              name: place.place_name,
              image: place.photo,
              location:
                cities.find((city) => city.id === place.cities_idcities)
                  ?.name || "Unknown",
              rating: place.star || 0,
              price: generateRandomPrice(),
              description: place.description,
              serviceInfo: place.service,
              cities_idcities: place.cities_idcities,
              categories_idcategories: place.categories_idcategories,
            }));

            setPlaces(formattedPlaces);
            setTotalItems(placesData.meta?.total || 0);

            // Fetch location data for each place
            formattedPlaces.forEach((place) => {
              fetchPlaceLocation(
                place.id,
                place.cities_idcities,
                place.categories_idcategories
              );
            });
          } else {
            setPlaces([]);
            setTotalItems(0);
          }
        }
      } catch (error) {
        console.error("Error fetching places:", error);
        setPlaces([]);
        setTotalItems(0);
      }
    });
  };

  // Add function to fetch location data for a place
  const fetchPlaceLocation = async (placeId, cityId, categoryId) => {
    try {
      // Set this button to loading state
      setLoadingButtons((prev) => ({ ...prev, [placeId]: true }));

      const languageId = localStorage.getItem("language_id");
      if (!placeId || !cityId || !categoryId || !languageId) {
        setLoadingButtons((prev) => ({ ...prev, [placeId]: false }));
        return;
      }

      const locationData = await getLocationData(
        placeId,
        cityId,
        categoryId,
        languageId
      );

      if (locationData && locationData.data && locationData.data.length > 0) {
        setPlaceLocations((prev) => ({
          ...prev,
          [placeId]: {
            latitude: locationData.data[0].vertical,
            longitude: locationData.data[0].horizontal,
          },
        }));
      }
    } catch (error) {
      console.error(`Error fetching location for place ${placeId}:`, error);
    } finally {
      // Remove loading state
      setLoadingButtons((prev) => ({ ...prev, [placeId]: false }));
    }
  };

  // Add function to handle map navigation
  const handleOpenMap = (place, e) => {
    e.stopPropagation(); // Prevent card click event

    // Check if we have location data for this place
    if (placeLocations[place.id]) {
      const { latitude, longitude } = placeLocations[place.id];
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, "_blank");
    } else {
      // Fallback to search by name if no coordinates
      const searchQuery = `${place.name}, ${place.location}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        searchQuery
      )}`;
      window.open(url, "_blank");
    }
  };

  // Add function to handle place details navigation
  const handlePlaceDetails = (place) => {
    // Store IDs in sessionStorage
    sessionStorage.setItem("category_place_id", place.categories_idcategories);
    sessionStorage.setItem("city_place_id", place.cities_idcities);

    // Navigate to action section
    navigate(
      `/cities/${place.categories_idcategories}/sites/${place.cities_idcities}/action/${place.id}`
    );
  };

  // Fetch places when activeService changes (triggered by city change or manual selection)
  useEffect(() => {
    if (activeService !== null && activeCity !== null) {
      setCurrentPage(1);
      fetchPlacesForService(1);
      fetchAvailableStars();
    }
  }, [activeService, activeCity]);

  // Handle pagination changes
  useEffect(() => {
    if (activeService !== null && activeCity !== null) {
      fetchPlacesForService(currentPage);
    }
  }, [currentPage, starFilter]);

  // Helper function to generate random price indicator
  const generateRandomPrice = () => {
    const priceOptions = ["$", "$$", "$$$"];
    return priceOptions[Math.floor(Math.random() * priceOptions.length)];
  };

  // City select options for mobile view
  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: (
      <div className="flex items-center gap-2">
        <span>{city.name}</span>
      </div>
    ),
  }));

  // Add a function to check if star filter should be shown
  const shouldShowStarFilter = () => {
    if (!activeService) return false;

    const selectedService = serviceCategories.find(
      (service) => service.id === activeService
    );
    return selectedService && selectedService.type === 1;
  };

  // Check if star filter should be shown when serviceCategories or activeService changes
  useEffect(() => {
    if (!activeService || serviceCategories.length === 0) {
      setShowStarFilter(false);
      return;
    }

    const selectedService = serviceCategories.find(
      (service) =>
        service.id === activeService ||
        service.id === parseInt(activeService) ||
        service.id === String(activeService)
    );

    // Show star filter only for services with type === 1
    setShowStarFilter(selectedService && selectedService.type === 1);
  }, [serviceCategories, activeService]);

  // Helper function to handle filter changes with animation - FIXED VERSION
  const handleFilterChange = (filterType, value) => {
    // Check if the value is actually changing
    let isValueChanging = false;

    if (filterType === "service" && value !== activeService) {
      isValueChanging = true;
    } else if (filterType === "city" && value !== activeCity) {
      isValueChanging = true;
    } else if (filterType === "star" && value !== starFilter) {
      isValueChanging = true;
    }

    // Only apply fade animation and update state if value is actually changing
    if (isValueChanging) {
      // First, fade out the current cards
      const cards = document.querySelectorAll(".service-card");
      cards.forEach((card) => {
        card.classList.add("fade-out");
        card.classList.remove("aos-animate");
      });

      // After animation completes, update the filter
      setTimeout(() => {
        if (filterType === "service") {
          setActiveService(value);
        } else if (filterType === "city") {
          setActiveCity(value);
        } else if (filterType === "star") {
          setStarFilter(value);
        }
        setCurrentPage(1);
      }, 300);
    }
    // If value is not changing, do nothing (no fade animation, no state update)
  };

  // Update the filter handlers to use the animation function
  const handleServiceChange = (serviceId) => {
    // Convert serviceId to ensure consistent type
    const normalizedServiceId = parseInt(serviceId) || serviceId;

    // Update URL to reflect the new service
    navigate(`/services/${normalizedServiceId}`, { replace: true });
    handleFilterChange("service", normalizedServiceId);
  };

  const handleCityChange = (cityId) => {
    handleFilterChange("city", cityId);
  };

  const handleStarFilterChange = (value) => {
    handleFilterChange("star", value);
  };

  // Initialize AOS with better settings for staggered animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false, // Changed to false to allow re-animation when filtering
      offset: 50,
      delay: 0, // Base delay that will be added to data-aos-delay
      mirror: true, // Whether elements should animate out while scrolling past them
    });
  }, []);

  // Refresh AOS when loading state changes or places are loaded
  useEffect(() => {
    if (!loading) {
      // Small timeout to ensure DOM is updated before refreshing AOS
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [loading, places, currentPage]);

  // Reset AOS animations when filters change
  useEffect(() => {
    if (activeService !== null || activeCity !== null || starFilter !== 0) {
      // Remove AOS animations before filter changes
      document.querySelectorAll("[data-aos]").forEach((el) => {
        el.classList.remove("aos-animate");
      });
    }
  }, [activeService, activeCity, starFilter]);

  return (
    <div className="services-platform mt-12 min-h-screen bg-gray-50 md:flex">
      {/* Sidebar Component */}
      <ServicesSidebar
        serviceCategories={serviceCategories}
        activeService={activeService}
        onServiceChange={handleServiceChange}
        isRTL={isRTL}
      />

      {/* Main Content - adjust margin based on RTL */}
      <main
        className={`main-content md:w-[calc(100%-240px)]  md:flex-1   ${
          isRTL ? "md:mr-[240px]" : "md:ml-[240px]"
        } pt-[60px] md:pt-0`}
      >
        {/* Mobile Scroll Services */}
        <div className="md:hidden w-full px-4 pt-4 pb-2 bg-white shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 px-1">
            {t("services.selectService", "Select Service")}
          </h2>
          <Swiper
            slidesPerView="12"
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            className="w-full pb-2 "
            initialSlide={serviceCategories.findIndex(
              (service) => service.id === activeService
            )}
          >
            {serviceCategories.map((service) => (
              <SwiperSlide key={service.id} className="!w-auto">
                <button
                  data-service-id={service.id}
                  onClick={() => handleServiceChange(service.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeService === service.id
                      ? "bg-orange-100 text-orange-500 font-semibold shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {service.name}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Cities Filter */}
        <div className="w-full px-4 mt-4 md:mt-6 bg-white md:bg-transparent py-4 md:py-0 shadow-sm md:shadow-none">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 pl-1">
            {t("services.selectCity", "Select City")}
          </h2>

          {/* Mobile View - Dropdown */}
          <div className="md:hidden">
            <Select
              value={activeCity}
              onChange={handleCityChange}
              style={{ width: "100%" }}
              options={cityOptions}
              className="city-select"
              size="large"
              placeholder={t("services.selectCityPlaceholder", "Choose a city")}
            />
          </div>

          {/* Desktop View - Swiper */}
          <div className="hidden md:block">
            <Swiper
              slidesPerView={11}

              spaceBetween={10}
              freeMode={true}
              modules={[FreeMode]}
              className="w-full cursor-grab"
            >
              {cities.map(({ id, name }) => (
                <SwiperSlide key={id} className="!w-auto">
                  <button
                    onClick={() => handleCityChange(id)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeCity === id
                        ? "bg-orange-100 text-orange-500 font-semibold shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                    }`}
                  >
                    {name}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Star Rating Filter Component */}
        <StarRatingFilter
          starFilter={starFilter}
          onStarFilterChange={handleStarFilterChange}
          availableStars={availableStars}
          loading={loading}
          shouldShow={showStarFilter}
        />

        {/* Places Grid */}
        <div className="services-container  ">
          {loading ? (
            <div className="loading-spinner flex justify-center items-center py-12">
              <div className="spinner" />
            </div>
          ) : (
            <>
              <div className="services-grid">
                {places.length > 0 ? (
                  places.map((place, index) => (
                    <div
                      key={place?.id}
                      className="service-card"
                      data-aos="fade-up"
                      data-aos-delay={(index % 3) * 100} // Stagger by column in a 3-column grid
                      data-aos-duration="800"
                      onClick={() => handlePlaceDetails(place)}
                    >
                      <div className="service-image-container">
                        <LazyImage
                          src={place?.image}
                          alt={place?.name}
                          className="w-full h-full service-image"
                        />
                        {place.rating && place.rating.number && (
                          <div className="rating-badge">
                            <FaStar className="rating-icon" />
                            <span>{place.rating.number}</span>
                          </div>
                        )}
                      </div>
                      <div className="service-details">
                        <div className="service-header">
                          <h3>{place?.name}</h3>
                          <span className="service-price">{place?.price}</span>
                        </div>
                        <div className="service-location">
                          <FaMapMarkerAlt className="location-icon" />
                          <span>{place?.location}</span>
                        </div>
                        <p className="service-description">
                          {place?.description}
                        </p>
                        <div className="service-actions">
                          <button
                            className="details-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaceDetails(place);
                            }}
                          >
                            View Details
                          </button>
                          {placeLocations[place.id] && (
                            <button
                              className="navigate-btn"
                              onClick={(e) => handleOpenMap(place, e)}
                            >
                              <FaLocationArrow className="navigate-icon" />
                              Navigate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 px-4">
                    <div className="max-w-md mx-auto">
                      <div className="text-gray-400 text-6xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {t("services.noResults", "No Results Found")}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {t(
                          "services.noResultsMessage",
                          "No places found for this service and city. Try selecting different options."
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {totalItems > pageSize && (
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={(page) => {
                      setCurrentPage(page);
                      // Smooth scroll to top of results
                      document
                        .querySelector(".services-container")
                        .scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServicesSection;
