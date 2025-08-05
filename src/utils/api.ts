import axios from 'axios';
import { ApiResponse, StockOutItem } from '../types';

// API Base URL - same as original app
export const apiBaseURL = 'http://10.122.73.131:8700/wh-stockout';

// API Endpoints
export const loginApi = `${apiBaseURL}/api/loginApps/Stockout/confirmLogin`;
export const whStockoutApi = `${apiBaseURL}/api/warehouse/stockoutAndroid`;

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
      username,
      password,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Login Error:', error);
    return {
      success: false,
      message: 'Login failed',
    };
  }
};

