import React from 'react';
import {
  FaGlobe,
  FaHistory,
  FaMosque,
  FaMountain,
  FaUtensils,
  FaBook,
  FaCamera,
  FaMapMarkedAlt,
  FaUsers,
  FaHeart
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './aboutUs.css';
import about from '../../assets/aboutUs.png'

const AboutUs = () => {
  const { t } = useTranslation();

  const features = [
    { icon: <FaHistory className="icon" />, label: t("aboutUs.features.historicalSites") },
    { icon: <FaMosque className="icon" />, label: t("aboutUs.features.culturalHeritage") },
    { icon: <FaMountain className="icon" />, label: t("aboutUs.features.naturalLandscapes") },
    { icon: <FaUtensils className="icon" />, label: t("aboutUs.features.localCuisine") },
    { icon: <FaCamera className="icon" />, label: t("aboutUs.features.aerialPhotography") },
    { icon: <FaMapMarkedAlt className="icon" />, label: t("aboutUs.features.interactiveMaps") }
  ];

  const appHighlights = [
    {
      icon: <FaGlobe className="card-icon-custom" />,
      title: t("aboutUs.highlights.tourismGuide.title"),
      text: t("aboutUs.highlights.tourismGuide.text")
    },
    {
      icon: <FaCamera className="card-icon-custom" />,
      title: t("aboutUs.highlights.documentation.title"),
      text: t("aboutUs.highlights.documentation.text")
    },
    {
      icon: <FaMapMarkedAlt className="card-icon-custom" />,
      title: t("aboutUs.highlights.touristMap.title"),
      text: t("aboutUs.highlights.touristMap.text")
    },
    {
      icon: <FaHeart className="card-icon-custom" />,
      title: t("aboutUs.highlights.culturalAwareness.title"),
      text: t("aboutUs.highlights.culturalAwareness.text")
    }
  ];

  return (
    <section className="about">
      <div className="container">
        <div className="header">
          <h2>{t("aboutUs.pageTitle")}</h2>
          <div className="divider"></div>
        </div>

        <div className="content">
          <div className="image-wrapper">
            <img
              src={about}
              alt="Syrian Heritage"
              className="image"
            />
          </div>

          <div className="text-content">
            <h3>{t("aboutUs.sectionTitle")}</h3>
            <p className="intro">
              {t("aboutUs.intro")}
            </p>

            <div className="features">
              {features.map((feature, index) => (
                <div key={index} className="feature">
                  {feature.icon}
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>

            <p className="description">
              {t("aboutUs.description")}
            </p>

            <div className="quote">
              <p>
                {t("aboutUs.quote")}
              </p>
            </div>
          </div>
        </div>

        <div className="values">
          <h3>{t("aboutUs.highlightsTitle")}</h3>
          <div className="cards">
            {appHighlights.map((highlight, index) => (
              <div key={index} className="card">
                {highlight.icon}
                <h4>{highlight.title}</h4>
                <p>{highlight.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="additional-info">
          <div className="info-card">
            <h4>{t("aboutUs.additionalInfo.database.title")}</h4>
            <p>
              {t("aboutUs.additionalInfo.database.text")}
            </p>
          </div>
          <div className="info-card">
            <h4>{t("aboutUs.additionalInfo.navigation.title")}</h4>
            <p>
              {t("aboutUs.additionalInfo.navigation.text")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

