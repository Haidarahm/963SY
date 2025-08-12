import axiosInstance from './config';

/**
 * Submits a contact form to the admin
 * @param {Object} contactData - The contact form data
 * @param {string} contactData.name - The name of the person contacting
 * @param {string} contactData.email - The email address of the person contacting
 * @param {string} contactData.subject - The subject of the contact message
 * @param {string} contactData.message - The content of the contact message
 * @returns {Promise<Object>} Response data
 */
export const submitContactForm = async (contactData) => {
  try {
    const response = await axiosInstance.post('/contact-admin', contactData);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};
