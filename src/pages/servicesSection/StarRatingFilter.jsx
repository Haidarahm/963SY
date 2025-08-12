import React from "react";
import { Radio, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";

const StarRatingFilter = ({
  starFilter,
  onStarFilterChange,
  availableStars,
  loading,
  shouldShow,
}) => {
  const { t } = useTranslation();

  // Don't render if shouldn't show
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="w-full px-4 mt-4 md:mt-6 bg-white md:bg-transparent py-4 md:py-0 shadow-sm md:shadow-none">
     
      {loading && availableStars.length === 0 ? (
        <div className="text-center py-4">
          <Spin size="small" />
        </div>
      ) : availableStars.length > 0 ? (
        <div className="star-filter-container">
          <Radio.Group
            value={starFilter}
            onChange={(e) => onStarFilterChange(e.target.value)}
            buttonStyle="solid"
            className="star-filter-group"
          >
            <Radio.Button value={0} className="star-filter-btn">
              {t("services.all", "All")}
            </Radio.Button>
            {availableStars.map((star) => (
              <Radio.Button
                key={star.id}
                value={star.id}
                className="star-filter-btn"
              >
                <span className="flex items-center gap-1">
                  {star.number}
                  <FaStar className="text-yellow-400 text-xs" />
                </span>
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      ) : (
        <div className="no-stars-message text-gray-500 text-sm py-2">
          {t("services.noStarsAvailable", "No stars available")}
        </div>
      )}
    </div>
  );
};

export default StarRatingFilter;
