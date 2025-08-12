import axiosInstance from "./config";
/**
 * Fetches media data for a specific place * @param {number|string} placeId - ID of the place
 * @param {number|string} cityId - ID of the city * @param {number|string} categoryId - ID of the category
 * @param {number|string} languageId - ID of the language * @returns {Promise<object>} - The media data from the API
 */ export const getMediaData = async (
  placeId,
  cityId,
  categoryId,
  languageId
) => {
  try {
    const response = await axiosInstance.get(
      `/media1/media/place/${placeId}/city/${cityId}/category/${categoryId}/language/${languageId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch media data:", error);
    throw error;
  }
};
