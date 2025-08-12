
import axiosInstance from './config';

/**
 * Fetches available star ratings for a specific category, language, service, and city
 * @param {number|string} categoryId - The ID of the category
 * @param {number|string} languageId - The ID of the language
 * @param {number|string} serviceId - The ID of the service
 * @param {number|string} cityId - The ID of the city
 * @returns {Promise<Object>} Response data containing available star ratings
 */
export const fetchStarsByCategory = async (categoryId, languageId, serviceId, cityId) => {
  try {
    const response = await axiosInstance.get(
      `/star1/star/category/${categoryId}/language/${languageId}/service/${serviceId}/city/${cityId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching stars by category:", error);
    throw error;
  }
};

