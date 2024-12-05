import axiosInstance from '@/api/index';

export const getAllSurveyOutlet = async () => {
  try {
    const response = await axiosInstance.get('/notification');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/notification', {
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
    const response = await axiosInstance.get(`/notification/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createComment = async (data) => {
  try {
    const response = await axiosInstance.post('/notification', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/notification/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/notification/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
