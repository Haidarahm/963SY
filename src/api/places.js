// api/places.js
import axiosInstance from './config';

/**
 * Fetches places by city ID, category ID, and language ID
 * @param {number|string} cityId - The ID of the city
 * @param {number|string} categoryId - The ID of the category
 * @param {number|string} languageId - The ID of the language
 * @returns {Promise<Object>} Response data
 */
export const fetchPlacesByCityCategoryAndLanguage = async (cityId, categoryId, languageId) => {
  try {
    const response = await axiosInstance.get(`/place1/places/city/${cityId}/category/${categoryId}/language/${languageId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching places:", error);
    throw error;
  }
};

/**
 * Fetches a single place by its ID
 * @param {number|string} id - The ID of the place
 * @returns {Promise<Object>} Response data
 */
export const fetchPlaceById = async (id) => {
  try {
    const response = await axiosInstance.get(`/place1/places/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching place with ID ${id}:`, error);
    throw error;
  }
};
/**
 * Filters places by city ID, category ID, language ID, and service ID
 * @param {number|string} cityId - The ID of the city
 * @param {number|string} categoryId - The ID of the category
 * @param {number|string} languageId - The ID of the language
 * @param {number|string} serviceId - The ID of the service
 * @returns {Promise<Object>} Response data
 */
export const filterPlaceByService = async (cityId, categoryId, languageId, serviceId,per_page,page) => {
    try {
        const response = await axiosInstance.get(`/place1/places/city/${cityId}/category/${categoryId}/language/${languageId}/service/${serviceId}`,{
            params:{
                per_page,
                page
            }
        });
    return response.data;
  } catch (error) {
    console.error("Error filtering places by service:", error);
    throw error;
  }
};
/**
 * Fetches places by category ID and language ID
 * @param {number|string} categoryId - The ID of the category
 * @param {number|string} languageId - The ID of the language
 * @param {number|string} per_page - Number of items per page (optional)
 * @param {number|string} page - Page number (optional)
 * @returns {Promise<Object>} Response data
 */
export const fetchPlacesByCategory = async (categoryId, languageId, per_page, page) => {
  try {
    const response = await axiosInstance.get(`/place1/places/category/${categoryId}/language/${languageId}`, {
      params: {
        per_page,
        page
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching places by category:", error);
    throw error;
  }
};

/**
 * Filters places by city ID, category ID, language ID, service ID, and star ID
 * @param {number|string} cityId - The ID of the city
 * @param {number|string} categoryId - The ID of the category
 * @param {number|string} languageId - The ID of the language
 * @param {number|string} serviceId - The ID of the service
 * @param {number|string} starId - The ID of the star rating (0 for all)
 * @param {number|string} per_page - Number of items per page (optional)
 * @param {number|string} page - Page number (optional)
 * @returns {Promise<Object>} Response data
 */
export const filterPlaceByServiceAndStar = async (cityId, categoryId, languageId, serviceId, starId, per_page, page) => {
  try {
    // If star ID is 0 (all), use the regular service filter
    if (starId === 0) {
      return filterPlaceByService(cityId, categoryId, languageId, serviceId, per_page, page);
    }

    // Otherwise, use the star filter endpoint
    const response = await axiosInstance.get(
      `/place1/places/city/${cityId}/category/${categoryId}/language/${languageId}/service/${serviceId}/star/${starId}`,
      {
        params: {
          per_page,
          page
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering places by service and star:", error);
    throw error;
  }
};


