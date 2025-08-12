import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./mainSection.css";
import background from "../../../assets/background.webp";
import { useNavigate } from "react-router";
import MainSwiper from "./MainSwiper";
// Import GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MainSection = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === "ar";
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const preTitleRef = useRef(null);
  const dividerRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);
  const swiperRef = useRef(null);

  // Check for mobile device on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
          duration: 1,
        }
      });

      gsap.set([
        preTitleRef.current, titleRef.current, subtitleRef.current,
        dividerRef.current, descriptionRef.current, buttonRef.current
      ], { opacity: 0, y: 30 });

      if (!isMobile && swiperRef.current) {
        gsap.set(swiperRef.current, { opacity: 0, x: isRTL ? -50 : 50 });
      }

      tl.to(preTitleRef.current, { opacity: 1, y: 0, duration: 0.6 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
        .to(dividerRef.current, { opacity: 1, y: 0, width: "100%", duration: 0.6 }, "-=0.4")
        .to(subtitleRef.current, { opacity: 1, y: 0 }, "-=0.2")
        .to(descriptionRef.current, { opacity: 1, y: 0 }, "-=0.6")
        .to(buttonRef.current, { opacity: 1, y: 0 }, "-=0.4");

      if (!isMobile && swiperRef.current) {
        tl.to(swiperRef.current, { opacity: 1, x: 0, duration: 1.2 }, "-=0.8");
      }
    }, sectionRef);

    // Refresh ScrollTrigger after all DOM/layout is ready
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isRTL, isMobile]);

  return (
    <section
      id="home"
      className="main-section"
      ref={sectionRef}
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container">
        {/* Left Content */}
        <div className="text-content">
          <div className="title-group">
            <span className="pre-title" ref={preTitleRef}>{t("mainSection.subtitle")}</span>
            <h1 className="main-title" ref={titleRef}>
              <span className="title-part-1">963</span>
              <span className="title-part-2">SY</span>
            </h1>
            <div className="title-divider" ref={dividerRef}></div>
            <h2 className="subtitle" ref={subtitleRef}>{t("mainSection.title")}</h2>
          </div>

          <p className="description" ref={descriptionRef}>{t("mainSection.des")}</p>

          <button
            className={`explore-btn ${isRTL ? "ltr" : ""}`}
            onClick={() => navigate("/destinations")}
            ref={buttonRef}
          >
            {t("mainSection.button")}
            <svg className="arrow-icon" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right Swiper Gallery - Only render on non-mobile devices */}
        {!isMobile && <MainSwiper ref={swiperRef} />}
      </div>
    </section>
  );
};

export default MainSection;


