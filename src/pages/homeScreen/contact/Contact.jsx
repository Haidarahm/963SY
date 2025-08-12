import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Contact.css';
import { submitContactForm } from '../../../api/contact';
import { message } from 'antd';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitContactForm(formData);
      message.success(t('contact.successMessage'));
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      console.log()
    } catch (error) {
      message.error(t('contact.errorMessage'));
      console.error('Contact form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-header">
        <h2 className='section-title '>{t('contact.title')}</h2>
        <p className='section-subtitle'>{t('contact.subtitle')}</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h3>{t('contact.getInTouch')}</h3>

          <div className="info-item">
            <FaPhone />
            <div>
              <h4>{t('contact.phone.title')}</h4>
              <a href="tel:+963112345678">{t('contact.phone.number')}</a>
            </div>
          </div>

          <div className="info-item">
            <FaEnvelope />
            <div>
              <h4>{t('contact.email.title')}</h4>
              <a href="mailto:info@963sy.com">{t('contact.email.address')}</a>
            </div>
          </div>

          <div className="info-item">
            <FaMapMarkerAlt />
            <div>
              <h4>{t('contact.address.title')}</h4>
              <p>{t('contact.address.location')}</p>
            </div>
          </div>

          <div className="info-item">
            <FaClock />
            <div>
              <h4>{t('contact.workingHours.title')}</h4>
              <p>{t('contact.workingHours.mondayToThursday')}</p>
              <p>{t('contact.workingHours.fridaySaturday')}</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>{t('contact.sendMessage')}</h3>

          <div className="form-group">
            <label htmlFor="name">{t('contact.name')}</label>
            <input
              type="text"
              id="name"
              placeholder={t('contact.name')}
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('contact.emailAddress')}</label>
            <input
              type="email"
              id="email"
              placeholder={t('contact.emailAddress')}
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">{t('contact.subject')}</label>
            <input
              type="text"
              id="subject"
              placeholder={t('contact.subject')}
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">{t('contact.message')}</label>
            <textarea
              id="message"
              placeholder={t('contact.message')}
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-contact"></span>
            ) : (
              t('contact.submitButton')
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;


