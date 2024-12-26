
import axiosInstance from "@/api/index";


export const reportActivity = async (params) => {
  try {
    const response = await axiosInstance.get(`/report/activity`, {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const reportOutlet = async (params) => {
  try {
    const response = await axiosInstance.get('/report/outlet', {
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
