import { IProduct, IOrder } from '../types';

export class ApiClient {
  async getProducts(): Promise<IProduct[]> {
    const res = await fetch('/products');
    return res.json();
  }

  async sendOrder(order: IOrder) {
    const res = await fetch('/order', {
      method: 'POST',
      body: JSON.stringify(order)
    });

    return res.json();
  }
}
