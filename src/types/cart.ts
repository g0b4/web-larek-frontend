export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface ICartModel {
  items: CartItem[];
  addItem(item: CartItem): void;
  removeItem(id: string): void;
  clear(): void;
  getTotal(): number;
}
