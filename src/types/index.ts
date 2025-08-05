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

export type RootStackParamList = {
  Login: undefined;
  WOInstruction: undefined;
  FullCameraScan: {
    scanRead: (data: string) => void;
  };
};

