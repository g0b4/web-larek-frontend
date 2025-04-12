import { ProductServer, OrderData } from './product';

export interface IApiClient {
  getProducts(): Promise<ProductServer[]>;
  sendOrder(data: OrderData): Promise<void>;
}
