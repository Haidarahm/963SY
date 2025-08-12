import React, { useEffect, useState } from "react";
import {
    FaMapMarkerAlt,
    FaInfoCircle,
    FaSignLanguage,
    FaWifi,
    FaImages,
    FaPlay,
    FaStar,
} from "react-icons/fa";
import { useNavigate, useParams, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import { fetchPlaceById } from "../../../api/places";
import { getLocationData } from "../../../api/location";
import "./actions.css";
import LazyImage from "../../../components/lazy/LazyImage";
function Actions() {
    const { t } = useTranslation();
    const { placeId, CityId, id: categoryId } = useParams();
    const currentLanguage = localStorage.getItem("language_id");
    const [place, setPlace] = useState(null);
    const [location, setLocation] = useState(null);
    const [availableButtons, setAvailableButtons] = useState({
        location: false,
        info: true, // Always show info button
        sign: false,
        virtual: false,
        images: false,
        video: false,
    });

    // Get links from context provided by ActionSection
    const { youtubeLink, virtualRoamingLink, signLanguageLink } =
        useOutletContext() || {};

    useEffect(() => {
        const getPlace = async () => {
            try {
                const data = await fetchPlaceById(placeId);
                setPlace(data.data);
            } catch (error) {
                console.error("Error fetching place:", error);
            }
        };

        // Fetch location data
        const fetchLocationData = async () => {
            try {
                if (placeId && CityId && categoryId && currentLanguage) {
                    const locationData = await getLocationData(
                        placeId,
                        CityId,
                        categoryId,
                        currentLanguage
                    );

                    if (
                        locationData &&
                        locationData.data &&
                        locationData.data.length > 0
                    ) {
                        setLocation({
                            longitude: locationData.data[0].horizontal,
                            latitude: locationData.data[0].vertical,
                        });
                        setAvailableButtons((prev) => ({
                            ...prev,
                            location: true,
                        }));
                    }
                }
            } catch (err) {
                console.error("Error fetching location:", err);
            }
        };

        // Check for available media types
        const checkAvailableMedia = async () => {
            try {
                // Update button availability based on links from context
                setAvailableButtons((prev) => ({
                    ...prev,
                    sign: !!signLanguageLink,
                    virtual: !!virtualRoamingLink,
                    video: !!youtubeLink,
                }));

                // Check if images are available
                // This could be a separate API call or check if needed
                // For now, we'll assume images are available if the place has a photo
                if (place?.photo) {
                    setAvailableButtons((prev) => ({ ...prev, images: true }));
                }
            } catch (error) {
                console.error("Error checking media availability:", error);
            }
        };

        getPlace();
        fetchLocationData();

        // Run media check after place data is loaded
        if (place) {
            checkAvailableMedia();
        }
    }, [
        placeId,
        CityId,
        categoryId,
        currentLanguage,
        place?.id,
        youtubeLink,
        virtualRoamingLink,
        signLanguageLink,
    ]);

    const navigate = useNavigate();

    const handleOpenMap = () => {
        if (location) {
            const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
            window.open(url, "_blank"); // open in a new tab
        }
    };

    // Define buttons with their availability conditions
    const buttons = [
        {
            id: "location",
            action: handleOpenMap,
            icon: <FaMapMarkerAlt />,
            text: t("actions.location", "Go to Location"),
            available: availableButtons.location,
        },
        {
            id: "info",
            link: "info",
            icon: <FaInfoCircle />,
            text: t("actions.info", "Information"),
            available: availableButtons.info,
        },
        {
            id: "sign",
            link: "sign",
            icon: place?.place_type == 2 ? <FaPlay /> : <FaSignLanguage />,
            text:
                place?.place_type == 2
                    ? t("actions.videoPlayer2", "Video Player 2")
                    : t("actions.sign", "Signal Language"),
            available: availableButtons.sign,
        },
        {
            id: "virtual",
            link: "virtual",
            icon: <FaWifi />,
            text: t("actions.virtual", "Virtual Roaming"),
            available: availableButtons.virtual,
        },
        {
            id: "images",
            link: "images",
            icon: <FaImages />,
            text: t("actions.images", "Images"),
            available: availableButtons.images,
        },
        {
            id: "video",
            link: "video",
            icon: <FaPlay />,
            text: t("actions.video", "Video Player"),
            available: availableButtons.video,
        },
    ];

    return (
        <div className="content-wrapper">
            <div className="image-container">
                <LazyImage
                    src={place?.photo}
                    alt={"Syrian landscape"}
                    className="w-full h-full object-cover rounded-xl mb-4"
                />
                {place?.star && place.star.number && (
                    <div className="star-rating">
                        <FaStar className="star-icon" />
                        <span>{place.star.number}</span>
                    </div>
                )}
            </div>
            <div className="buttons-container">
                {buttons
                    .filter((btn) => btn.available)
                    .map((btn, i) => (
                        <button
                            key={i}
                            className="action-button"
                            onClick={
                                btn.action
                                    ? btn.action
                                    : () => navigate(btn.link)
                            }
                        >
                            <div className="button-icon">{btn.icon}</div>
                            <span className="button-text">{btn.text}</span>
                        </button>
                    ))}
            </div>
        </div>
    );
}

export default Actions;
