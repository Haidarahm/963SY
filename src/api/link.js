import axiosInstance from './config';

/**
 * Fetches link data from the API
 * @param {number} placeId - ID of the place
 * @param {number} cityId - ID of the city
 * @param {number} categoryId - ID of the category
 * @param {number} languageId - ID of the language
 * @returns {Promise<object>} - The link data from the API
 */
export const getLinkData = async (placeId, cityId, categoryId, languageId) => {
  try {
    const response = await axiosInstance.get(
      `/link1/links/place/${placeId}/city/${cityId}/category/${categoryId}/language/${languageId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch link data:', error);
    throw error;
  }
};
