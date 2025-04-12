export interface IProductData {
    id: string;
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: string;
  }
  
  export interface IProductItem extends IProductData {
    basketState: boolean;
  }
  
  export interface IProductListing extends IProductItem {}
  
  export interface IDeliveryInfo {
    paymentMethod: string;
    address: string;
  }
  
  export interface IContactDetails {
    email: string;
    phone: string;
  }
  
  export type IOrderForm = IDeliveryInfo & IContactDetails;
  
  export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
  }
  
  export interface IOrderConfirmation {
    total: number;
    id: string;
  }

  export interface ISuccessData {
    description: number;
  }
  
  export interface ISuccessAction {
    onClick: () => void;
  }