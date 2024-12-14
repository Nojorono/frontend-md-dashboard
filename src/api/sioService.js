import axiosInstance from '@/api/index';

export const getAll = async (params) => {
  try {
    const response = await axiosInstance.get('/sio', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllSio = async () => {
  try {
    const response = await axiosInstance.get('/sio/all');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to get a single outlet by ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/sio/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to create
export const createData = async (data) => {
  try {
    const response = await axiosInstance.post('/sio', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to update
export const updateData = async (id, data) => {
  try {
    const response = await axiosInstance.post(`/sio/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

// Function to delete
export const deleteData = async (id) => {
  try {
    const response = await axiosInstance.delete(`/sio/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getGallery = async (params) => {
  try {
    console.log(params);
    const response = await axiosInstance.get(`/sio-gallery`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const createGallery = async (data) => {
  try {
    const response = await axiosInstance.post('/sio-gallery', data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateGallery = async (id, data) => {
  try {
    console.log(id);
    const intId = parseInt(id, 10);
    const response = await axiosInstance.put(`/sio-gallery/${intId}`, data);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const deleteGallery = async (id) => {
  try {
    const response = await axiosInstance.delete(`/sio-gallery/${id}`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
