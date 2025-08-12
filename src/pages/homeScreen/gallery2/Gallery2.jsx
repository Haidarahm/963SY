import React, { useEffect } from 'react';
import background from '../../../assets/background-3.jpeg';
import image1 from '../../../assets/background-2.jpeg';
import image2 from '../../../assets/image-1.jpg';
import image3 from '../../../assets/image-2.jpg';
import image4 from '../../../assets/image-3.jpg';
import image5 from '../../../assets/image-4.jpg';
import image6 from '../../../assets/image-5.jpg';
import image7 from '../../../assets/image-6.jpg';
import image8 from '../../../assets/image-7.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

import './gallery.css';
import LazyImage from '../../../components/lazy/LazyImage';
import { useTranslation } from 'react-i18next';

function Gallery2() {
  const { t } = useTranslation();
  const items = t('gallery2.items', { returnObjects: true }) || [];

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false,
      offset: 50,
      delay: 0,
      mirror: true,
    });
  }, []);

  // Refresh AOS when items change
  useEffect(() => {
    if (hasValidItems) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [items]);

  const images = [
    image1, image2, image3, image4, image5, image6, image8, image7, image1
  ];

  // Check if items is actually an array
  const hasValidItems = Array.isArray(items) && items.length > 0;

  return (
    <div
      className="gallery-section-2 relative py-20 px-6 text-white flex flex-col"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Section Title */}
      <div
        className="max-w-3xl mx-auto text-center mb-16 relative z-2"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="text-4xl font-bold mb-4">{t('gallery2.sectionTitle')}</h2>
        <p className="text-lg text-gray-200">{t('gallery2.sectionSubtitle')}</p>
      </div>

      {/* Grid of Squares */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hasValidItems ? (
          items.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/20"
              data-aos="fade-up"
              data-aos-delay={index * 100}
              data-aos-duration="800"
            >
              <LazyImage
                src={images[index % images.length]}
                alt={item.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-200">{item.description}</p>
            </div>
          ))
        ) : (
          <div
            className="col-span-full text-center py-8"
            data-aos="fade-up"
          >
            <p className="text-xl text-white">{t('gallery2.noItemsMessage', 'No gallery items available at the moment.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery2;



