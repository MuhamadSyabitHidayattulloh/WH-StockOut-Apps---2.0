export class GenerateOneWayKanban {
  private oneWayKanbanQR: string;

  constructor(oneWayKanbanQR: string) {
    this.oneWayKanbanQR = oneWayKanbanQR;
  }

  getDate(): string {
    let fixCode = this.oneWayKanbanQR.substring(0, 7);
    return fixCode;
  }

  getWhCode(): string {
    let fixCode = this.oneWayKanbanQR.substring(22, 23);
    return fixCode;
  }

  getUniqueCode(): string {
    let uniqueCode = this.oneWayKanbanQR.substring(23);
    return uniqueCode;
  }

  getTotalPartNumber(): string {
    const partno = this.oneWayKanbanQR.substring(0, 15).trim();
    return partno;
  }

  getPartNumber(): string {
    const partnoSuffix = this.oneWayKanbanQR.substring(0, 15).trim();
    const partno = partnoSuffix.endsWith("A")
      ? partnoSuffix.slice(0, -1)
      : partnoSuffix;
    return partno;
  }

  getQtyPerKanban(): number {
    let qtyPerKanban = this.oneWayKanbanQR.substring(16, 22);

    let newQty = "";
    for (let index = 0; index < qtyPerKanban.length; index++) {
      if (qtyPerKanban.charAt(index) !== '0') {
        newQty += qtyPerKanban.charAt(index);
      }
    }
    return parseInt(newQty);
  }
}

