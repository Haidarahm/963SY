import axiosInstance from "./config";

/**
 * Search for places with filters
 * @param {string} name - Search term for place name
 * @param {number} star - Filter by star rating (0 for all)
 * @param {number} service - Filter by service ID (0 for all)
 * @param {number} page - Page number for pagination
 * @param {number} per_page - Number of items per page
 * @param {number} languageId - ID of the language
 * @returns {Promise<Object>} Response data
 */
export const searchPlaces = async (name, star = 0, service = 0, page = 1, per_page = 10, languageId) => {
  try {
    const response = await axiosInstance.post('/place1/search',
      {
        name: name,
        star: star,
        service: service,
        language: languageId
      },
      {
        params: {
          page,
          per_page
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching places:", error);
    throw error;
  }
};

