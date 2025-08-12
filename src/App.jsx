// App.js
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router";
import { LanguageProvider } from "./context/LanguageContext";

import LoadingLine from "./components/loadingLine/LoadingLine";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

import "./locales/i18n";
import LoadingLogo from "./components/loadingLogo/LoadingLogo";
// Lazy-loaded components
const AboutUs = lazy(() => import("./pages/aboutUs/AboutUs"));
const Culture = lazy(() => import("./pages/homeScreen/headerSection/Culture"));
const VirtualVisit = lazy(() =>
    import("./pages/actionSection/actions/VirtualVisit")
);
const ServicesSection = lazy(() =>
    import("./pages/servicesSection/ServicesSection")
);
const Sites = lazy(() => import("./pages/sitesOfCity/Sites"));
const SignVideo = lazy(() => import("./pages/actionSection/actions/SignVideo"));
const Services = lazy(() => import("./pages/homeScreen/services/Services"));
const PrivacyPolicy = lazy(() => import("./pages/privacy/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/notFound/NotFound"));
const HomeScreen = lazy(() => import("./pages/homeScreen/HomeScreen"));
const Cities = lazy(() => import("./pages/cities/Cities"));
const Destinations = lazy(() => import("./pages/destinations/Destinations"));
const Contact = lazy(() => import("./pages/homeScreen/contact/Contact"));
const ActionSection = lazy(() => import("./pages/actionSection/ActionSection"));
const Actions = lazy(() => import("./pages/actionSection/actions/Actions"));
const Video = lazy(() => import("./pages/actionSection/actions/Vedio"));
const SiteInfo = lazy(() => import("./pages/actionSection/actions/SiteInfo"));
const ImageGallery = lazy(() =>
    import("./pages/actionSection/actions/ImageGallery")
);

function App() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [previousLocation, setPreviousLocation] = useState(location);

    // Scroll to top on route change
    useEffect(() => {
        // Only scroll to top if there's no hash in the URL
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
    }, [location]);

    // Loading transition (optional)
    useEffect(() => {
        if (location.pathname !== previousLocation.pathname) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
                setPreviousLocation(location);
            }, 500); // shorter delay
            return () => clearTimeout(timer);
        }
    }, [location, previousLocation]);

    return (
        <LanguageProvider>
            <div className="scroll-smooth overflow-hidden">
                <LoadingLine isLoading={loading} />
                <Suspense fallback={<LoadingLogo />}>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/cities/:id" element={<Cities />} />
                        <Route
                            path="/cities/:id/sites/:CityId"
                            element={<Sites />}
                        />
                        <Route
                            path="/destinations"
                            element={<Destinations />}
                        />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/culture" element={<Culture />} />
                        <Route path="/experiences" element={<Services />} />
                        <Route
                            path="/services/:serviceId"
                            element={<ServicesSection />}
                        />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route
                            path="/cities/:id/sites/:CityId/action/:placeId"
                            element={<ActionSection />}
                        >
                            <Route index element={<Actions />} />
                            <Route path="video" element={<Video />} />
                            <Route path="sign" element={<SignVideo />} />
                            <Route path="virtual" element={<VirtualVisit />} />
                            <Route path="images" element={<ImageGallery />} />
                        </Route>
                        <Route
                            path="/cities/:id/sites/:CityId/action/:placeId/info"
                            element={<SiteInfo />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
                <Footer />
            </div>
        </LanguageProvider>
    );
}

export default App;
