import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import "./footer.css";
import { useLocation, useNavigate, Link } from "react-router";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const footerLinks = [
    { name: "home", path: location === "/" ? "#home" : "/" },
    {
      name: "destination",
      path: location === "/" ? "#destinations" : "/destinations",
    },
    {
      name: "services",
      path: location === "/" ? "#experiences" : "/experiences",
    },
    { name: "culture", path: location === "/" ? "#culture" : "/culture" },
    { name: "about", path: "/about" },
  ];

  const supportLinks = [
    { name: "privacy", path: "/privacy" },
    { name: "contact", path: "/contact" },
  ];

  const scrollToSection = (sectionId) => {
    if (sectionId.startsWith("/")) {
      navigate(sectionId);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLinkClick = (item) => {
    scrollToSection(
      item.path.startsWith("#") ? item.path.substring(1) : item.path
    );
  };

  // Check if we're on a services page to adjust footer styling
  const isServicesPage = location.startsWith("/services");

  return (
    <footer
      className={`footer-container ${
        isServicesPage ? "services-page-footer" : ""
      }`}
    >
      <div className="footer-content">
        <div className="footer-logo">
          <h3 onClick={() => navigate("/")}>
            963<span>SY</span>
          </h3>
          <p>{t("footer.description")}</p>
          <div className="social-icons">
            <a
              target="_blank"
              href="https://www.facebook.com/share/12J86eBRuZK/"
            >
              <FaFacebook />
            </a>

            <a
              target="_blank"
              href="https://www.instagram.com/963sy.app?igsh=eWV3bTkzZW14cjA="
            >
              <FaInstagram />
            </a>
            <a
              target="_blank"
              href="https://youtube.com/@963syapp?si=KpjVYAYEwy8oekRR"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>{t("footer.quickLinks")}</h4>
          <ul>
            {footerLinks.map((item) => (
              <li key={item.name}>
                {item.path.startsWith("#") || item.path === "/" ? (
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item);
                    }}
                  >
                    {t(`navbar.${item.name.toLowerCase()}`)}
                  </a>
                ) : (
                  <Link to={item.path}>
                    {t(`navbar.${item.name.toLowerCase()}`)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h4>{t("footer.support")}</h4>
          <ul>
            {supportLinks.map((item) => (
              <li key={item.name}>
                <Link to={item.path}>
                  {t(`footer.${item.name.toLowerCase()}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="contact-info">
          <h4>{t("footer.contactUs")}</h4>
          <div className="contact-item">
            <FaMapMarkerAlt />
            <p>{t("footer.address")}</p>
          </div>
          <div className="contact-item">
            <FaPhone />
            <p>{t("footer.phone")}</p>
          </div>
          <div className="contact-item">
            <FaEnvelope />
            <p>{t("footer.email")}</p>
          </div>
        </div>
      </div>

      <div className="copyright">
        &copy; {new Date().getFullYear()} 963SY. {t("footer.copyright")}
      </div>
    </footer>
  );
};

export default Footer;
