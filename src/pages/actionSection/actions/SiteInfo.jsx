import React, { useState, useEffect } from "react";
import "./SiteInfo.css";
import { useNavigate, useParams } from "react-router";
import { getMediaData } from "../../../api/media";
import { fetchPlaceById } from "../../../api/places";
import axios from "axios";
import { Spin } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "../../../locales/i18n";

const SiteInfo = () => {
  const { placeId, CityId: cityId, id: categoryId } = useParams();
  const currentLanguage = localStorage.getItem("language_id");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [placePhoto, setPlacePhoto] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const placeData = await fetchPlaceById(placeId);
        if (placeData && placeData.data && placeData.data.photo) {
          setPlacePhoto(placeData.data.photo);
        }
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };

    const fetchMediaContent = async () => {
      if (!placeId || !cityId || !categoryId || !currentLanguage) {
        return;
      }

      setLoading(true);
      try {
        // Fetch place data to get the photo
        await fetchPlaceData();

        // Fetch media data
        const mediaData = await getMediaData(
          placeId,
          cityId,
          categoryId,
          currentLanguage
        );

        // Filter for media with med_type === 2
        const textMedia = mediaData.data
          ? mediaData.data.find((item) => item.med_type === 2)
          : null;

        if (textMedia) {
          // Set the title from med_name
          setTitle(textMedia.med_name);

           const contentUrl = textMedia.med_content;
          const contentFilename = contentUrl.split('/').pop();
          const contentResponse = await axios.get(`/back/api/media/${contentFilename}`);
          setContent(contentResponse.data);
        } else {
          // Fallback content if no media with med_type === 2 is found
          setTitle("The Umayyad Mosque");
          setContent(
            t(
              "siteInfo.noDetailedInfo",
              "No detailed information available for this site."
            )
          );
        }
      } catch (error) {
        console.error("Error fetching media content:", error);
        setError("Failed to load site information. Please try again later.");

        // Set fallback content
        setTitle("The Umayyad Mosque");
        setContent("Unable to load site information at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaContent();
  }, [placeId, cityId, categoryId, currentLanguage, t]);
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <section className="site-info section-container mt-10">
      <div className="header-container">
        <h2 className="infoSection-title">{title}</h2>
      </div>

      <div className="content-container">
        <button onClick={handleBack} className="back-button">
          {t("common.back", "Back")}
        </button>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="text-section">
              <p className={`long-text ${isRTL ? 'text-right' : 'text-left'}`}>{content}</p>
            </div>

            <div className="image-section">
              <img
                src={
                  placePhoto ||
                  "https://i.pinimg.com/736x/1a/19/d8/1a19d823b8a89976092e1e3d2b1323bc.jpg"
                }
                alt={title}
                className="site-image"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SiteInfo;

