// src/api/languages.js
import axiosInstance from './config';

export const fetchLanguages = async () => {
  try {
    const response = await axiosInstance.get('/language1/languages');
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};
