import React from 'react';
import './PrivacyPolicy.css';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-content">
        <header className="privacy-header">
          <h1>{t('privacy.title')}</h1>
        </header>

        <section className="privacy-section">
          <p className="intro-text">{t('privacy.intro1')}</p>
          <p>{t('privacy.intro2')}</p>
          <p>{t('privacy.intro3')}</p>
          <p>{t('privacy.intro4')}</p>
        </section>

        <section className="privacy-section">
          <h2>{t('privacy.collection.title')}</h2>
          <p>{t('privacy.collection.text')}</p>
        </section>

        <section className="privacy-section">
          <h2>{t('privacy.cookies.title')}</h2>
          <p>{t('privacy.cookies.text1')}</p>
          <p className="highlight">{t('privacy.cookies.text2')}</p>
        </section>

        <section className="privacy-section">
          <h2>{t('privacy.providers.title')}</h2>
          <p>{t('privacy.providers.text1')}</p>
          <ul>
            <li>{t('privacy.providers.list1')}</li>
            <li>{t('privacy.providers.list2')}</li>
            <li>{t('privacy.providers.list3')}</li>
            <li>{t('privacy.providers.list4')}</li>
          </ul>
          <p>{t('privacy.providers.text2')}</p>
        </section>

        <section className="privacy-section">
          <h2>{t('privacy.security.title')}</h2>
          <p>{t('privacy.security.text')}</p>
        </section>

        <section className="privacy-section">
          <h2>{t('privacy.links.title')}</h2>
          <p>{t('privacy.links.text')}</p>
        </section>

        <section className="privacy-section">
          <h2>{t('privacy.children.title')}</h2>
          <p>{t('privacy.children.text')}</p>
        </section>

        <section className="privacy-section">
          <h2>{t('privacy.changes.title')}</h2>
          <p>{t('privacy.changes.text')}</p>
          <p className="effective-date">
            <strong>{t('privacy.changes.effective')}</strong>
          </p>
        </section>

        <section className="privacy-section contact-section">
          <h2>{t('privacy.contact.title')}</h2>
          <p>
            {t('privacy.contact.text')}{' '}
            <a href={`mailto:${t('privacy.contact.email')}`} className="contact-email">
              {t('privacy.contact.email')}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;