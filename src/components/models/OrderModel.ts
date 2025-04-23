import { IOrderPayload, IProductItem } from '../../types';
import { IEventEmitter, EmitterEvent } from '../../types/IEventEmitter';
import { IOrder } from '../../types/IOrder';
import { AbstractModel } from './AbstractModel';

export class OrderModel extends AbstractModel<IOrder> {
	/**
	 * Текущий заказ
	 *
	 * @type {IOrder}
	 */
	value: IOrder;

	/**
	 * Ошибки при отправке заказа
	 *
	 * @type {string[]}
	 */
	errors: string[] = [];

	/**
	 * Создает экземпляр модели заказа
	 *
	 * @param {IEventEmitter} eventEmitter - диспетчер событий
	 */
	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}

	/**
	 * Сбрасывает заказ к изначальному состоянию
	 */
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

	/**
	 * Обновляет заказ
	 *
	 * @param {IOrder} value - новый заказ
	 */
	setValue(value: IOrder) {
		this.value = value;
		this.eventEmitter.emit('order-updated');
	}

	/**
	 * Обновляет поле заказа
	 *
	 * @param {keyof IOrder} field - поле заказа
	 * @param {IOrder[keyof IOrder]} value - новое значение поля
	 */
	updateField<K extends keyof IOrder>(field: K, value: IOrder[K]) {
		Object.assign(this.value, { [field]: value });
		this.eventEmitter.emit('order-updated');
		this.eventEmitter.emit(('order-updated:' + field) as keyof EmitterEvent, {
			value,
		});
	}

	/**
	 * Проверяет, является ли заказ валидным
	 *
	 * @returns {boolean} - true, если заказ валидный
	 */
	validateOrder(): boolean {
		return this.value.payment && this.value.address?.length > 0;
	}

	/**
	 * Проверяет, является ли контакт валидным
	 *
	 * @returns {boolean} - true, если контакт валидный
	 */
	validateContacts(): boolean {
		return this.value.email?.length > 0 && this.value.phone?.length > 0;
	}

	/**
	 * Преобразует заказ в формат, пригодный для отправки на сервер
	 *
	 * @returns {IOrderPayload} - заказ в формате, пригодном для отправки на сервер
	 */
	toOrderPayload(): IOrderPayload {
		return {
			...this.value,
			items: this.value.items.map((item) => item.id),
			total: this.total,
		};
	}

	/**
	 * Обновляет ошибки при отправке заказа
	 *
	 * @param {string[]} errors - ошибки при отправке заказа
	 */
	updateErrors(errors: string[]) {
		this.errors = errors;
		this.eventEmitter.emit('order-errors-updated');
	}

	/**
	 * Проверяет, находится ли продукт в корзине
	 *
	 * @param {IProductItem} item - продукт
	 * @returns {boolean} - true, если продукт находится в корзине
	 */
	isInCart(item: IProductItem) {
		return this.value.items.some((product) => product.id === item.id);
	}

	/**
	 * Добавляет/удаляет продукт из корзины
	 *
	 * @param {IProductItem} product - продукт
	 */
	toggleProduct(product: IProductItem) {
		this.updateField(
			'items',
			this.isInCart(product)
				? this.value.items.filter((product) => product.id !== product.id)
				: [...this.value.items, product]
		);
	}

	/**
	 * Общая сумма заказа
	 *
	 * @type {number}
	 */
	get total() {
		return this.value.items.reduce((acc, item) => acc + item.price, 0);
	}
}
