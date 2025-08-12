// api/cities.js
import axiosInstance from './config';

/**
 * Fetches cities by category ID and language ID
 * @param {number|string} categoryId - The ID of the category
 * @param {number|string} languageId - The ID of the language
 * @returns {Promise<Object>} Response data
 */
export const fetchCitiesByCategoryAndLanguage = async (categoryId, languageId, per_page, page) => {
    try {
        const response = await axiosInstance.get(`/city1/cities/category/${categoryId}/language/${languageId}`, {
            params: {
                per_page,
                page
            }
        });
        console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};
export const showCity = async (id) => {
  try {
    const response = await axiosInstance.get(`/city1/cities/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


