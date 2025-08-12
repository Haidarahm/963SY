import axiosInstance from './config';

/**
 * Fetches location data from the API
 * @param {number} placeId - ID of the place
 * @param {number} cityId - ID of the city
 * @param {number} categoryId - ID of the category
 * @param {number} languageId - ID of the language
 * @returns {Promise<object>} - The location data from the API
 */
export const getLocationData = async (placeId, cityId, categoryId, languageId) => {
  try {
    const response = await axiosInstance.get(
      `/way1/ways/place/${placeId}/city/${cityId}/category/${categoryId}/language/${languageId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch location data:', error);
    throw error;
  }
};
