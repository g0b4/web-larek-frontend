import { submitOrder } from '../api/submitOrder';
import { IOrderPayload } from '../types';
import { IOrderModel } from '../types/IOrderModel';
import { EventEmitter } from './base/events';

export class OrderModel {
	value: IOrderModel;
	eventEmitter = new EventEmitter();
	errors: string[] = [];
	constructor() {
		this.reset();
	}
	reset() {
		this.setValue({
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		});
		this.eventEmitter.emit('updated');
		this.eventEmitter.emit('updated:items');
		this.eventEmitter.emit('updated:total');
	}
	resetErors() {
		this.errors = [];
		this.eventEmitter.emit('updated');
	}
	setValue(value: IOrderModel) {
		this.value = value;
		this.eventEmitter.emit('updated');
	}
	updateField<K extends keyof IOrderModel>(field: K, value: IOrderModel[K]) {
		Object.assign(this.value, { [field]: value });
		this.eventEmitter.emit('updated');
		if (field === 'items') {
			this.updateTotal();
			this.eventEmitter.emit('updated:items');
			this.eventEmitter.emit('updated:total');
		}
	}
	validateOrder(): boolean {
		return this.value.payment && this.value.address?.length > 0;
	}
	validateContacts(): boolean {
		return this.value.email?.length > 0 && this.value.phone?.length > 0;
	}
	submit() {
		return submitOrder(this.asJson())
			.then((response) => response)
			.catch((error) => {
				this.errors = [error];
				this.eventEmitter.emit('updated');
				throw error;
			});
	}
	asJson(): IOrderPayload {
		return {
			...this.value,
			items: this.value.items.map((item) => item.id),
		};
	}
	updateTotal() {
		this.value.total = this.value.items.reduce(
			(acc, item) => acc + item.price,
			0
		);
	}
}
