import axios from 'axios';
import { ApiResponse, StockOutItem } from '../types';

// API Base URL - same as original app
export const apiBaseURL = 'http://10.122.73.131:8700';

// API Endpoints
export const loginApi = `${apiBaseURL}/api/loginApps/Stockout/confirmLogin`;
export const loginQrApi = `${apiBaseURL}/api/loginApps/Stockout/confirmLoginQr`;
export const whStockoutApi = `${apiBaseURL}/api/warehouse/stockoutAndroid`;

// Registration endpoints
export const checkNpkApi = `${apiBaseURL}/api/registration/checkNpk`;
export const showCompanyApi = `${apiBaseURL}/api/registration/showCompany`;
export const showPlantApi = `${apiBaseURL}/api/registration/showPlant`;
export const registerNewApi = `${apiBaseURL}/api/registration/registerNew`;
export const updateRoleApi = `${apiBaseURL}/api/registration/updateRole`;

// API Functions
export const submitStockOutData = async (data: StockOutItem[], slip: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(whStockoutApi, {
      data: data,
      slip: slip,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Failed to submit data',
    };
  }
};

export const loginUser = async (username: string, password: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(loginApi, {
      USERNAME: username,
      PASSWORD: password,
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Login Error:', error);
    return {
      success: false,
      message: 'Login failed',
    };
  }
};

export const loginUserQr = async (qrData: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(loginQrApi, {
      qrData: qrData,
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('QR Login Error:', error);
    return {
      success: false,
      message: 'QR Login failed',
    };
  }
};

// Registration API Functions
export const checkNpk = async (userID: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(checkNpkApi, {
      userID: userID,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Check NPK Error:', error);
    return {
      success: false,
      message: 'Failed to check NPK',
    };
  }
};

export const getCompanies = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(showCompanyApi);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Companies Error:', error);
    return {
      success: false,
      message: 'Failed to get companies',
    };
  }
};

export const getPlants = async (companyCode: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`${showPlantApi}?companyCode=${companyCode}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Get Plants Error:', error);
    return {
      success: false,
      message: 'Failed to get plants',
    };
  }
};

export const registerNewUser = async (userData: {
  userID: string;
  password: string;
  name: string;
  company: string;
  plant: string;
  buCode: string;
  email?: string;
}): Promise<ApiResponse> => {
  try {
    const response = await axios.post(registerNewApi, userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Register User Error:', error);
    return {
      success: false,
      message: 'Failed to register user',
    };
  }
};

export const updateUserRole = async (userID: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post(updateRoleApi, {
      userID: userID,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Update Role Error:', error);
    return {
      success: false,
      message: 'Failed to update role',
    };
  }
};

