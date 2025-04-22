import { IOrderPayload } from '../../types';
import { IEventEmitter, EmitterEvent } from '../../types/IEventEmitter';
import { IOrder } from '../../types/IOrder';
import { AbstractModel } from './AbstractModel';

export class OrderModel extends AbstractModel<IOrder> {
	value: IOrder;
	errors: string[] = [];
	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}
	reset() {
		this.setValue({
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
		});
		this.eventEmitter.emit('order-updated');
		this.eventEmitter.emit('order-updated:items');
	}
	setValue(value: IOrder) {
		this.value = value;
		this.eventEmitter.emit('order-updated');
	}
	updateField<K extends keyof IOrder>(field: K, value: IOrder[K]) {
		Object.assign(this.value, { [field]: value });
		this.eventEmitter.emit('order-updated');
		this.eventEmitter.emit(('order-updated:' + field) as keyof EmitterEvent, {
			value,
		});
	}
	validateOrder(): boolean {
		return this.value.payment && this.value.address?.length > 0;
	}
	validateContacts(): boolean {
		return this.value.email?.length > 0 && this.value.phone?.length > 0;
	}
	asJson(): IOrderPayload {
		return {
			...this.value,
			items: this.value.items.map((item) => item.id),
			total: this.total,
		};
	}

	updateErrors(errors: string[]) {
		this.errors = errors;
		this.eventEmitter.emit('order-errors-updated');
	}

	get total() {
		return this.value.items.reduce((acc, item) => acc + item.price, 0);
	}
}
