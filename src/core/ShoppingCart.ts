import { Model } from './Model';
import { IEvents } from './EventBus';
import {
  IAppStateData,
  IProduct,
  IProductItem,
  IOrder,
  IContactsForm,
  FormErrors,
} from '../types';
import { IOrderForm } from '../types/models'; 
export class ShoppingCart extends Model<IAppStateData> {
  protected products: IProductItem[] = [];
  protected basket: IProductItem[] = [];

  protected order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
    items: [],
    total: 0,
  };

  protected formErrors: FormErrors = {};

  constructor(events: IEvents) {
    super({}, events);
  }

  protected emitChanges(): void {
    this.events.emit('shoppingCart:change', {
      products: this.products,
      basket: this.getBasketItems(),
      order: this.getOrderDetails(),
      errors: this.getFormErrors(),
    });
  }

  setProducts(items: IProduct[]): void {
    this.products = items.map((item) => ({
      ...item,
      basketState: false,
    }));
    this.emitChanges();
  }

  getProducts(): IProductItem[] {
    return this.products;
  }

  getAvailableProducts(): IProductItem[] {
    return this.products.filter((item) => !item.basketState);
  }

  getBasketItems(): IProductItem[] {
    this.basket = this.products.filter((item) => item.basketState);
    return this.basket;
  }

  getCartItems(): IProductItem[] {
    return this.getBasketItems();
  }

  setPreviewCard(item: IProductItem): void {
    this.events.emit('preview:open', item);
  }

  setSelectedProduct(item: IProductItem): void {
    this.setPreviewCard(item);
  }

  addToBasket(item: IProductItem): void {
    const product = this.products.find((product) => product.id === item.id);
    if (product) {
      product.basketState = true;
      this.emitChanges();
    }
  }

  removeFromBasket(item: IProductItem): void {
    const product = this.products.find((product) => product.id === item.id);
    if (product) {
      product.basketState = false;
      this.emitChanges();
    }
  }

  removeFromCart(item: IProductItem): void {
    this.removeFromBasket(item);
  }

  toggleCartItem(item: IProductItem): void {
    const product = this.products.find((product) => product.id === item.id);
    if (product) {
      product.basketState = !product.basketState;
      this.emitChanges();
    }
  }

  clearCart(): void {
    this.products.forEach((item) => (item.basketState = false));
    this.emitChanges();
  }

  getCartTotal(): number {
    return this.getBasketItems().reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  updateOrderInfo(field: keyof IOrderForm, value: string): void {
    switch (field) {
      case 'address':
        this.order.address = value;
        break;
      case 'paymentMethod':
        this.order.payment = value;
        break;
      case 'email':
        this.order.email = value;
        break;
      case 'phone':
        this.order.phone = value;
        break;
      default:
        console.warn(`Unknown order field: ${field}`);
    }
  
    this.validateOrder();
    this.emitChanges();
  }

  validateOrder(): boolean {
    const errors: FormErrors = {};

    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес доставки';
    }
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  getOrderDetails(): IOrderForm {
    return {
      email: this.order.email,
      phone: this.order.phone,
      address: this.order.address,
      paymentMethod: this.order.payment, 
    };
  }

  getFormErrors(): FormErrors {
    return this.formErrors;
  }
}