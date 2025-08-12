import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";

const Video = () => {
  const { t } = useTranslation();
  const { youtubeLink } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState(null);
  const navigate = useNavigate();

  // Convert regular YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // Extract video ID from various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      // Return standard embed URL with video ID
      return `https://www.youtube.com/embed/${match[2]}?rel=0`;
    }

    // Return original URL if unable to parse
    return url;
  };

  useEffect(() => {
    // Simulate loading time for URL processing
    setLoading(true);
    const timer = setTimeout(() => {
      setEmbedUrl(getEmbedUrl(youtubeLink));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [youtubeLink]);

  const handleBack = () => {
    navigate(-1); // Adjust this route if "action" is a section on the same page
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={handleBack}
        className="back-button"
      >
        {t("common.back", "Back")}
      </button>

      {/* YouTube iframe */}
      <div className="w-full max-w-3xl aspect-video">
        {loading ? (
          <div className="w-full h-full rounded-lg border-2 flex items-center justify-center bg-gray-100"
               style={{ borderColor: "#F26A1B" }}>
            <div className="spinner"></div>
          </div>
        ) : embedUrl ? (
          <iframe
            className="w-full h-full rounded-lg border-2"
            style={{ borderColor: "#F26A1B" }}
            src={embedUrl}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div
            className="w-full h-full rounded-lg border-2 flex items-center justify-center bg-gray-100"
            style={{ borderColor: "#F26A1B" }}
          >
            <p className="text-gray-500">{t("video.noVideo", "No video available")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;

