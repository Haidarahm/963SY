import React, { useState, useEffect } from "react";
import { Pagination, Card } from "antd";
import "./sites.css";
import { useNavigate, useParams } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import { fetchPlacesByCityCategoryAndLanguage } from "../../api/places";
import { showCity } from "../../api/cities";
import { showCategory } from "../../api/categories";
import { useTranslation } from "react-i18next";
import i18n from "../../locales/i18n";

const { Meta } = Card;

const Sites = () => {
  const navigate = useNavigate();
  const { CityId: cityId } = useParams();
  const { id: categoryId } = useParams();
  const { currentLanguage: language } = useLanguage();
  const currentLanguage = localStorage.getItem("language_id");
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [transition, setTransition] = useState("");
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityData, setCityData] = useState({
    city_name: t("loading"),
    description: t("loadingCityInfo"),
    photo: null,
  });
  const [categoryData, setCategoryData] = useState({
    cat_name: t("loading", "Loading..."),
    description: "",
  });

  const pageSize = 6;

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch places data
        const placesData = await fetchPlacesByCityCategoryAndLanguage(
          cityId,
          categoryId,
          currentLanguage
        );
        setSites(placesData.data);

        // Fetch city data
        const cityResponse = await showCity(cityId);
        if (cityResponse.data) {
          setCityData({
            city_name: cityResponse.data.city_name,
            description: cityResponse.data.description,
            photo: cityResponse.data.photo,
          });
        }

        // Fetch category data
        const categoryResponse = await showCategory(categoryId);
        if (categoryResponse.data) {
          setCategoryData({
            cat_name: categoryResponse.data.cat_name || "Loading ...",
            description: categoryResponse.data.description || "",
          });
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (cityId && categoryId && currentLanguage) {
      fetchData();
    }
  }, [cityId, categoryId, currentLanguage, language]);

  const currentCards = sites.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setTransition("fade-out");

    setTimeout(() => {
      setCurrentPage(page);
      setTransition("fade-in");

      setTimeout(() => setTransition(""), 300);
    }, 300);
  };

  return (
    <div className="sites-page">
      {/* Header Section */}
      <header
        className="sites-header"
        style={{
          backgroundImage: cityData.photo ? `url(${cityData.photo})` : "none",
        }}
      >
        <div className="header-overlay">
          <h1>{cityData.city_name}</h1>
          <p>{cityData.description}</p>
        </div>
      </header>

      {/* Tourism Sites Section */}
      <section className="tourism-section">
        <div className="section-header">
          <h2>{categoryData.cat_name}</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            {t("sites.discoverSubtitle", {
              categoryName: categoryData.cat_name,
              cityName: cityData.city_name,
            })}
          </p>
        </div>

        {loading ? (
          <div className="loading-container">{t("sites.loadingSites", "Loading sites...")}</div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : sites.length === 0 ? (
          <div className="no-data-container">
            {t("sites.noSitesFound", "No tourism sites found for this location.")}
          </div>
        ) : (
          <>
            <div className={`cards-container ${transition}`}>
              {currentCards.map((site) => (
                <Card
                  key={`${site.id}-${currentPage}`}
                  hoverable
                  className="tourism-card"
                  cover={
                    <div className="card-image-container">
                      <img alt={site.title} src={site.photo} />
                      <div className="image-overlay"></div>
                    </div>
                  }
                >
                  <Meta
                    title={site.place_name}
                    description={
                      <>
                        <p className="card-description">{site.description}</p>
                        <button
                          className="card-button"
                          onClick={() => navigate(`action/${site.id}`)}
                        >
                          {t("common.explore", "Explore")} {site.place_name}
                        </button>
                      </>
                    }
                  />
                </Card>
              ))}
            </div>

            <Pagination
              current={currentPage}
              total={sites.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              className="pagination"
              showSizeChanger={false}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Sites;




