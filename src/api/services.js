import axiosInstance from './config'; // Your custom axios instance

/**
 * Fetches all services
 * @returns {Promise<Object>} Response data
 */
export const fetchAllServices = async () => {
  try {
    const response = await axiosInstance.get('/service1/services');
    return response.data;
  } catch (error) {
    console.error("Error fetching all services:", error);
    throw error;
  }
};

/**
 * Fetches a single service by ID
 * @param {number|string} id
 * @returns {Promise<Object>} Response data
 */
export const showService = async (id) => {
  try {
    const response = await axiosInstance.get(`/service1/services/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
};

/**
 * Filters services by city, category, and language
 * @param {number|string} cityId
 * @param {number|string} categoryId
 * @param {number|string} languageId
 * @returns {Promise<Object>} Response data
 */
export const filterServices = async (cityId, categoryId, languageId) => {
  try {
    const response = await axiosInstance.get(
      `/service1/services/city/${cityId}/category/${categoryId}/language/${languageId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering services:", error);
    throw error;
  }
};
