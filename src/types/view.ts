import { ProductView } from './product';
import { CartItem } from './cart';

export interface ICatalogView {
  render(products: ProductView[]): void;
  onProductClick(id: string): void;
}

export interface IModalView {
  open(content: HTMLElement): void;
  close(): void;
}

export interface ICartView {
  render(items: CartItem[]): void;
  onRemoveItem(id: string): void;
}

export interface ICheckoutView {
  renderStep1(): void;
  renderStep2(): void;
  onSubmitStep1(data: { address: string; payment: string }): void;
  onSubmitStep2(data: { email: string; phone: string }): void;
}
