export type PaymentMethod = 'card' | 'cash';

export interface DeliveryDetails {
  address: string;
  payment: PaymentMethod;
}

export interface ContactDetails {
  email: string;
  phone: string;
}

export interface OrderData {
  items: string[];
  delivery: DeliveryDetails;
  contacts: ContactDetails;
}

export interface IOrderModel {
  delivery?: DeliveryDetails;
  contacts?: ContactDetails;
  isValidStep1(): boolean;
  isValidStep2(): boolean;
}
