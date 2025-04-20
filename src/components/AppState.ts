import { getProducts } from '../api/getProducts';
import { IOrderResponse, IProductItem } from '../types';
import { IAppState } from '../types/IAppState';
import { EventEmitter } from './base/events';
import { OrderModel } from './OrderModel';

export class AppState implements IAppState {
	currentProduct: IProductItem;
	eventEmitter = new EventEmitter();
	productList: IProductItem[] = [];
	lastOrderTotal: number;
	order = new OrderModel();

	addToCart(item: IProductItem) {
		this.order.updateField('items', [...this.order.value.items, item]);

		this.order.resetErors();
	}
	removeFromCart(item: IProductItem) {
		this.order.updateField(
			'items',
			this.order.value.items.filter((product) => product.id !== item.id)
		);
		this.order.resetErors();
	}
	setProductList(productList: IProductItem[]) {
		this.productList = productList;
		this.eventEmitter.emit('products-updated');
	}
	setCurrentProduct(product: IProductItem | null) {
		this.currentProduct = product;
		this.eventEmitter.emit('current-product-updated');
	}
	isInCart(product: IProductItem): boolean {
		return !!this.order.value.items.find((item) => item.id === product.id);
	}
	openBasket() {
		this.eventEmitter.emit('open-basket');
	}
	openOrderForm(): void {
		this.eventEmitter.emit('open-order-form');
	}
	openContactsForm(): void {
		this.eventEmitter.emit('open-contacts-form');
	}
	openSuccess(): void {
		this.eventEmitter.emit('open-success');
	}
	closeSuccess(): void {
		this.eventEmitter.emit('close-success');
	}

	submitOrder() {
		return this.order.submit().then((response: IOrderResponse) => {
			this.lastOrderTotal = response.total;
			this.eventEmitter.emit('after-submit');
			this.order.reset();
			this.openSuccess();
		});
	}
	fetchData(): void {
		getProducts().then(({ items }) => {
			this.setProductList(items);
		});
	}
}
