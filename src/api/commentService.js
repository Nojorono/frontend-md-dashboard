import axiosInstance from '@/api/index';

// Function to get all active outlets
export const getAllSurveyOutlet = async () => {
  try {
    const response = await axiosInstance.get('/comment');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/comment', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getByActivityId = async (id) => {
  try {
    const response = await axiosInstance.get(`/comment/activity/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createComment = async (data) => {
  try {
    const response = await axiosInstance.post('/comment', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/comment/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/comment/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
