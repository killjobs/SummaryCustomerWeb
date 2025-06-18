export interface SummaryCustomer {
    id: number;
    userId: number;
    orderNumber: number;
    createdDate?: string;
    fullName: string;
    phoneNumber: string;
    purchaseSummary: string;
    cost: number;
    active: boolean;
  }