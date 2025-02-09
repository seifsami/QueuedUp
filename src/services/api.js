import axios from 'axios';

const API_BASE_URL = "https://queuedup-backend-6d9156837adf.herokuapp.com"
const API_BASE_URL_HOMEPAGE = 'https://queuedup-backend-6d9156837adf.herokuapp.com/homepage';

const API = axios.create({ baseURL: API_BASE_URL });

// API calls for user authentication
export const registerUser = (userData) => API.post(`/user/register`, userData);
export const getUserProfile = (firebaseId) => API.get(`/user/profile/${firebaseId}`);

export const getTrendingMedia = async (mediaType) => {
    try {
      const response = await axios.get(`${API_BASE_URL_HOMEPAGE}/trending/${mediaType}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch trending media');
    }
  };
  
  export const getUpcomingMedia = async (mediaType) => {
    try {
      const response = await axios.get(`${API_BASE_URL_HOMEPAGE}/upcoming/${mediaType}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch upcoming media');
    }
  };

  export const addToWatchlist = async (userId, itemId, mediaType) => {
    const BASE_URL = 'https://queuedup-backend-6d9156837adf.herokuapp.com';  // Backend base URL
    try {
      const response = await axios.post(
        `${API_BASE_URL}/watchlist/${userId}`,  // Include userId in the URL
        {
          item_id: itemId,
          media_type: mediaType,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw new Error('Failed to add to watchlist');
    }
  };
  
  
  // Fetch user's watchlist
  export const getUserWatchlist = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/watchlist/${userId}`);
      return response;  // Axios response object, call `response.data` to access the data
    } catch (error) {
      console.error('Error fetching user watchlist:', error);
      throw error;  // So the component can handle the error appropriately
    }
  };

  
export const updateUserProfile = (firebaseId, updatedData) => {
  return API.put(`/user/update/${firebaseId}`, updatedData)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    });
};

export const submitRequest = async (requestData) => {
  try {
    const response = await axios.post(`https://queuedup-backend-6d9156837adf.herokuapp.com/api/request`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting request:', error);
    throw new Error('Failed to submit request');
  }
};
