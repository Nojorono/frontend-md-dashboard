
import axiosInstance from "@/api/index";


export const reportActivity = async (params) => {
  try {
    const response = await axiosInstance.get(`/report/activity/`, {
      params: params,
      responseType: 'blob',
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
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const reportReimbursement = async (params) => {
  try {
    const response = await axiosInstance.get('/report/reimbursement', {
      params: params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};

export const reportAbsent = async (params) => {
  try {
    const response = await axiosInstance.get('/report/absent', {
      params: params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
