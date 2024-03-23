export class CreateOrderDto {
  code: string;
  status: number;
  paymentMethod: {
    type: number;
    code: number;
  };
  paymentLink?: string;
  grossAmount: number;
  discountAmount: number;
  feeAmount: number;
  netAmount: number;
  extraAmount: number;
  installmentCount: number;
  items: {
    item: {
      id: string;
      description: string;
      quantity: number;
      amount: number;
    }[];
  };
  sender: {
    name: string;
    email: string;
    phone: {
      areaCode: string;
      number: string;
    };
    documents: {
      document: {
        type: string;
        value: string;
      };
    };
  };
  cancellationSource?: string;
}
