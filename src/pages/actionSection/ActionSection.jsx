import React, { useState, useEffect } from "react";
import "./actionSection.css";
import { Outlet, useParams } from "react-router";
import { fetchPlaceById } from "../../api/places";
import { getLinkData } from "../../api/link";
import { getMediaData } from "../../api/media";
import { useTranslation } from "react-i18next";

const ActionSection = () => {
  const { placeId, CityId: cityId, id: categoryId } = useParams();
  const currentLanguage = localStorage.getItem("language_id");
  const [place, setPlace] = useState(null);
  const [links, setLinks] = useState({
    youtubeLink: null,
    virtualRoamingLink: null,
    signLanguageLink: null,
  });
  const [hasImages, setHasImages] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const getPlace = async () => {
      try {
        const data = await fetchPlaceById(placeId);
        setPlace(data.data);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };

    const getLinks = async () => {
      try {
        const linkData = await getLinkData(
          placeId,
          cityId,
          categoryId,
          currentLanguage
        );

        // Extract links based on their types
        const youtubeLink = linkData.data.find((link) => link.link_type === 2);
        const virtualRoamingLink = linkData.data.find(
          (link) => link.link_type === 3
        );
        const signLanguageLink = linkData.data.find(
          (link) => link.link_type === 1
        );

        setLinks({
          youtubeLink: youtubeLink ? youtubeLink.link_http : null,
          virtualRoamingLink: virtualRoamingLink
            ? virtualRoamingLink.link_http
            : null,
          signLanguageLink: signLanguageLink
            ? signLanguageLink.link_http
            : null,
        });
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    const checkForImages = async () => {
      try {
        const mediaData = await getMediaData(
          placeId,
          cityId,
          categoryId,
          currentLanguage
        );

        // Check if there are any images (med_type === 1)
        const hasImageMedia =
          mediaData.data && mediaData.data.some((item) => item.med_type === 1);

        setHasImages(hasImageMedia);
      } catch (error) {
        console.error("Error checking for images:", error);
        setHasImages(false);
      }
    };

    if (placeId && cityId && categoryId && currentLanguage) {
      getPlace();
      getLinks();
      checkForImages();
    }
  }, [placeId, cityId, categoryId, currentLanguage]);

  return (
    <section className="action-section">
      <div className="section-header">
        <h2 className="section-title">
          {place ? place.place_name : t("actionSection.loading")}
        </h2>
        <p className="section-subtitle">
          {place ? place.description : t("actionSection.pleaseWait")}
        </p>
      </div>
      <Outlet
        context={{
          placeId,
          cityId,
          categoryId,
          youtubeLink: links.youtubeLink,
          virtualRoamingLink: links.virtualRoamingLink,
          signLanguageLink: links.signLanguageLink,
          hasImages: hasImages,
          place: place,
        }}
      />
    </section>
  );
};

export default ActionSection;
