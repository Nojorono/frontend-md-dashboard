import axiosInstance from "@/api/index";


export const getAllSio = async () => {
  try {
    const response = await axiosInstance.get(`/sio/all`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllBrand = async () => {
  try {
    const response = await axiosInstance.get(`/brand/all`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllRegion = async () => {
  try {
    const response = await axiosInstance.get(`/region/all`);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const getAllArea = async () => {
  try {
    const response = await axiosInstance.get('/area/all');
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
