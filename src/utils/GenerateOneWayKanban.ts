import { OneWayKanban } from '../types';

export class GenerateOneWayKanban implements OneWayKanban {
  private qrData: string;

  constructor(qrData: string) {
    this.qrData = qrData;
  }

  getPartNumber(): string {
    // Extract part number from QR data (assuming specific format)
    // This is a simplified implementation based on the original code
    if (this.qrData.length >= 20) {
      return this.qrData.substring(0, 10);
    }
    return 'UNKNOWN';
  }

  getQtyPerKanban(): number {
    // Extract quantity from QR data (assuming specific format)
    // This is a simplified implementation
    if (this.qrData.length >= 30) {
      const qtyStr = this.qrData.substring(20, 25);
      const qty = parseInt(qtyStr, 10);
      return isNaN(qty) ? 1 : qty;
    }
    return 1;
  }
}

