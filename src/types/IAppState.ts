import { EventEmitter } from '../components/base/events';
import { OrderModel } from '../components/OrderModel';
import { IProductItem } from './IProductItem';

export interface IAppState {
	eventEmitter: EventEmitter;
	productList: IProductItem[];
	currentProduct: IProductItem | null;
	order: OrderModel;
	lastOrderTotal: number;
	addToCart(item: IProductItem): void;
	removeFromCart(item: IProductItem): void;
	setCurrentProduct(product: IProductItem | null): void;
	isInCart(product: IProductItem): boolean;
	openBasket(): void;
	openOrderForm(): void;
	openContactsForm(): void;
	openSuccess(): void;
	closeSuccess(): void;
	submitOrder(): void;
	fetchData(): void;
}
