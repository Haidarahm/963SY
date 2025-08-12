import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";

const VirtualVisit = () => {
  const { virtualRoamingLink } = useOutletContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const iframeContainerRef = useRef(null); // Ref for fullscreen
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFullscreen = () => {
    const elem = iframeContainerRef.current;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  // Handle iframe loading state
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
  };

  // Reset loading state when virtualRoamingLink changes
  useEffect(() => {
    setIsLoading(true);
    setIframeError(false);
  }, [virtualRoamingLink]);

  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-primary-500 rounded text-white hover:text-primary-500 transition hover:bg-white border hover:border-primary-500"
        >
          {t("common.back", "Back")}
        </button>
        {virtualRoamingLink && !isLoading && !iframeError && (
          <button
            onClick={handleFullscreen}
            className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-900 transition"
          >
            {t("virtualVisit.fullscreen", "Fullscreen")}
          </button>
        )}
      </div>

      <div
        ref={iframeContainerRef}
        className="w-full h-[70vh] md:h-screen border border-primary-500 rounded-md"
      >
        {virtualRoamingLink ? (
          <>
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">{t("virtualVisit.loading", "Loading virtual tour...")}</p>
                </div>
              </div>
            )}
            <iframe
              src={virtualRoamingLink}
              className={`w-full h-full border-0 ${isLoading ? 'hidden' : 'block'}`}
              title="Virtual Visit Experience"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
            {iframeError && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                  {t("virtualVisit.error", "Failed to load virtual tour. Please try again later.")}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">
              {t("virtualVisit.notAvailable", "Virtual tour not available for this location")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualVisit;

