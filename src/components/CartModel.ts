import { IProduct, ICartItem } from '../types';

export class CartModel {
  private items: ICartItem[] = [];

  addItem(product: IProduct) {
    if (!this.items.find(item => item.id === product.id)) {
      this.items.push({ ...product, quantity: 1 });
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter(item => item.id !== productId);
  }

  getItems() {
    return this.items;
  }
}
