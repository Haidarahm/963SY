// api/categories.js
import axiosInstance from './config'; // Correct import of custom axios instance

/**
 * Fetches categories based on the given language ID
 * @param {number|string} languageId
 * @returns {Promise<Object>} Response data
 */
export const fetchCategoriesByLanguage = async (languageId) => {
  try {
    const response = await axiosInstance.get(`/category1/category/language/${languageId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const showCategory = async (id) => {
  try {
    const response = await axiosInstance.get(`/category1/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
