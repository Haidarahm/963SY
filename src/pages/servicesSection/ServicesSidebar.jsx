import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const ServicesSidebar = ({
  serviceCategories,
  activeService,
  onServiceChange,
  isRTL
}) => {
  const { serviceId } = useParams();
  const { t } = useTranslation();

  // Check if a service should be active based on URL param
  const isServiceActive = (service) => {
    if (serviceId) {
      // Convert both to numbers or strings for comparison
      return service.id === parseInt(serviceId) || service.id === serviceId;
    }
    return service.id === activeService;
  };

  // Scroll to active service when sidebar loads
  useEffect(() => {
    if (serviceCategories.length > 0) {
      const activeButton = document.querySelector('.services-sidebar-container button.active-service');
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [serviceCategories, activeService, serviceId]);

  return (
    <aside
      className={`hidden  mt-[60px] md:flex w-[240px] min-h-screen bg-white shadow-lg fixed ${
        isRTL ? "right-0" : "left-0"
      } top-0 z-20 flex-col items-center py-6`}
    >
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">{t("services.sidebarTitle", "963SY Services")}</h1>
      </div>
      <div className="flex flex-col w-full px-4 gap-3 services-sidebar-container">
        {serviceCategories.map((service) => (
          <button
            key={service.id}
            data-service-id={service.id}
            onClick={() => onServiceChange(service.id)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isServiceActive(service)
                ? "bg-orange-100 text-orange-500 font-semibold active-service"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {service.name}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default ServicesSidebar;


