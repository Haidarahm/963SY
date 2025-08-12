import React from 'react';
import { useTranslation } from 'react-i18next';
import mobileMockup from '../../../assets/mobile.png'; // Your mockup image
import appStoreBadge from '../../../assets/icons/AppStore.svg';
import playStoreBadge from '../../../assets/icons/GooglePlay.svg';
import './uploadApp.css';
import LazyImage from '../../../components/lazy/LazyImage';

const UploadApp = () => {
  const { t } = useTranslation();

  return (
    <section className="upload-app-section">
      <div className="container">
        {/* Left Text Content */}
        <div className="text-content">
          <span className="section-label">{t('uploadApp.downloadNow')}</span>
          <h2 className="section-title">{t('uploadApp.title')}</h2>
          <p className="section-description">
            {t('uploadApp.description')}
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>{t('uploadApp.feature1')}</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>{t('uploadApp.feature2')}</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>{t('uploadApp.feature3')}</span>
            </div>
          </div>

          <div className="download-buttons">
            <a href="#" className="store-button">
              <img src={appStoreBadge} alt={t('uploadApp.appStoreAlt')} />
            </a>
            <a href="#" className="store-button">
              <img src={playStoreBadge} alt={t('uploadApp.playStoreAlt')} />
            </a>
          </div>
        </div>

        {/* Right Mockup */}
        <div className="mockup-container">
          <div className="phone-mockup">
            <LazyImage
              src={mobileMockup}
              alt={t('uploadApp.title')}
              className="mockup-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadApp;
