import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import "./Navbar.css";
import { useNavigate, Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import Languages from "./Languages";
import SearchForm from "./SearchForm";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const isRTL = i18n.language === "ar";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setCurrentLanguage] = useState("EN");
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef(null);

  const navItems = [
    { name: "home", path: location === "/" ? "#home" : "/" },
    {
      name: "destination",
      path: location === "/" ? "#destinations" : "/destinations",
    },
    { name: "services", path: location === "/" ? "#experiences" : "/experiences" },
    { name: "culture", path: location === "/" ? "#culture" : "/culture" },
    { name: "about", path: "/about" },
    { name: "contact", path: "/contact" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const closeSearch = () => setIsSearchOpen(false);

  const scrollToSection = (sectionId) => {
    if (sectionId.startsWith("/")) {
      navigate(sectionId);
      closeMenu();
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeMenu();
  };

  const handleNavClick = (item) => {
    setActiveItem(item.name);
    scrollToSection(
      item.path.startsWith("#") ? item.path.substring(1) : item.path
    );
  };

  // Function to determine if a nav item is active based on current location
  const isActive = (item) => {
    if (location === "/") {
      // On homepage, check if activeItem is set (for hash navigation)
      return item.name === activeItem;
    } else if (item.path === "/") {
      // For the home button when not on homepage
      return location === "/";
    } else if (item.path.startsWith("#")) {
      // For hash links when not on homepage, they're never active
      return false;
    } else {
      // For regular links, check if location starts with the path
      // This handles both exact matches and sub-routes
      return location.startsWith(item.path);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Set active item based on current location when component mounts or location changes
  useEffect(() => {
    if (location === "/") {
      // On homepage, we might want to set active based on scroll position
      // For now, default to "home" when on homepage
      setActiveItem("home");
    } else {
      // Find the nav item that matches the current location
      const currentNavItem = navItems.find(item =>
        !item.path.startsWith("#") && location.startsWith(item.path)
      );

      if (currentNavItem) {
        setActiveItem(currentNavItem.name);
      } else {
        // If no match found, clear active state
        setActiveItem("");
      }
    }

    // Close menu when location changes
    closeMenu();
  }, [location]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      // If a language is stored in localStorage, set it
      i18n.changeLanguage(storedLanguage);
      setCurrentLanguage(storedLanguage.toUpperCase());
      document.documentElement.dir = storedLanguage === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = storedLanguage;
    } else {
      // Default to "EN" if no language is stored
      i18n.changeLanguage("en");
      setCurrentLanguage("EN");
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Close menu on scroll
    const handleScrollClose = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("scroll", handleScrollClose);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollClose);
      // Cleanup body overflow on unmount
      document.body.style.overflow = 'auto';
    };
  }, [i18n, isMenuOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <nav
      className={`navbar-container ${
        location === "/services" || scrolled ? "scrolled" : ""
      }`}
      ref={menuRef}
    >
      <div className={`logo ltr`} onClick={() => navigate("/")}>
        963<span>SY</span>
      </div>

      <ul className={`menu ${isMenuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <li
            key={item.name}
            className="menu-item"
            onClick={() => handleNavClick(item)}
          >
            {item.path.startsWith("#") || item.path === "/" ? (
              <a
                href={item.path}
                className={isActive(item) ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
              >
                {t(`navbar.${item.name.toLowerCase()}`)}
              </a>
            ) : (
              <Link
                to={item.path}
                className={isActive(item) ? "active" : ""}
                onClick={closeMenu}
              >
                {t(`navbar.${item.name.toLowerCase()}`)}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="right-section">
        <SearchForm
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onToggle={toggleSearch}
        />

        <div className={location === '/' ? '' : 'hidden'}>
          <Languages />
        </div>

        <div className="mobile-menu-button" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
