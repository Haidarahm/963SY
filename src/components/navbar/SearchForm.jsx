import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { searchPlaces } from "../../api/search"; // Adjust path as needed
import { useNavigate } from "react-router";
import "./SearchForm.css"; // Ensure you handle dropdown styling

const SearchForm = ({ isOpen, onClose, onToggle }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isRTL, setIsRTL] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If user submits the form, search for the query
      fetchResults(searchQuery);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleResultClick = (place) => {
    sessionStorage.setItem("category_place_id", place.categories_idcategories);
    sessionStorage.setItem("city_place_id", place.cities_idcities);
    navigate(
      `/cities/${place.categories_idcategories}/sites/${place.cities_idcities}/action/${place.id}`
    );
    onClose();
    setSearchQuery("");
    setSearchResults([]);
  };

  const storedLanguage = localStorage.getItem("language");
  useEffect(() => {
    setIsRTL(storedLanguage === "ar");
  }, [storedLanguage]);

  // Function to ensure focus is maintained
  const maintainFocus = () => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();

      // Schedule another focus check in case it gets lost
      focusTimeoutRef.current = setTimeout(maintainFocus, 100);
    }
  };

  const fetchResults = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    // Start focus maintenance during loading
    maintainFocus();

    try {
      const languageId = localStorage.getItem("language_id");
      const result = await searchPlaces(query, 0, 0, 1, 10, languageId);
      setSearchResults(result.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
      // Ensure focus after loading completes
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    // Clear any existing timeout when searchQuery changes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Only make request if there's a search query
    if (searchQuery.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        fetchResults(searchQuery);
      }, 1000); // Wait for 2 seconds of inactivity
    } else {
      setSearchResults([]);
    }

    // Cleanup function to clear timeout when component unmounts or effect reruns
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".search-container")) {
        onClose();
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Focus management when search is opened/closed
  useEffect(() => {
    if (isOpen) {
      // Initial focus when opened
      maintainFocus();
    } else {
      // Clear any pending focus timeouts when closed
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      // Also clear the debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    }

    // Cleanup function to clear timeout when component unmounts or effect reruns
    return () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [isOpen]);

  return (
    <div className="search-container">
      <div className="search-icon" onClick={onToggle}>
        <FaSearch />
      </div>

      {isOpen && (
        <div className={`search-input-container ${isRTL ? "rtl" : "ltr"}`}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              ref={searchInputRef}
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={t("navbar.searchPlaceholder")}
              className="search-input"
              dir={isRTL ? "rtl" : "ltr"}
              disabled={loading}
              autoFocus
              onBlur={() => {
                // Re-focus if the search is still open
                if (isOpen) {
                  setTimeout(() => {
                    if (searchInputRef.current && isOpen) {
                      searchInputRef.current.focus();
                    }
                  }, 10);
                }
              }}
            />
            <button type="submit" className="search-submit" disabled={loading}>
              {loading ? (
                <span className="loading-indicator"></span>
              ) : (
                <FaSearch />
              )}
            </button>
          </form>

          {loading ? (
            <div className="search-loading">{t("search.loading")}</div>
          ) : searchResults.length > 0 ? (
            <ul className="search-results-dropdown">
              {searchResults.map((place) => (
                <li
                  key={place.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(place)}
                >
                  {place.place_name}
                </li>
              ))}
            </ul>
          ) : searchQuery.trim() !== "" ? (
            <div className="no-results">
              {t("search.noResults") || "No results found"}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
