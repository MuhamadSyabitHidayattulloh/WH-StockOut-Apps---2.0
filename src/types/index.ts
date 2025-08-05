export interface StockOutItem {
  imgData: string;
  timeScan: string;
  NPK: string;
  partNumber: string;
  qty: number;
  processId: string;
  color?: string;
}

export interface User {
  USERNAME: string;
  USERID: string;
  plant_code?: string;
  token?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface OneWayKanban {
  getPartNumber(): string;
  getQtyPerKanban(): number;
}

export interface Company {
  company_code: string;
  company_name: string;
}

export interface Plant {
  plant_code: string;
  plant_name: string;
  company_code: string;
}

export interface RegistrationData {
  userID: string;
  password: string;
  name: string;
  company: string;
  plant: string;
  buCode: string;
  email?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  WOInstruction: undefined;
  FullCameraScan: {
    scanRead: (data: string) => void;
    scanType: 'qr' | 'kanban';
  };
};

