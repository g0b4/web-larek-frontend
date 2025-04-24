import { IOrder } from './IOrder';

// типизация названий событий для удобства
export type EmitterEvent = {
	/**
	 * Событие обновления активного продукта
	 */
	'active-product-updated': null;

	/**
	 * Событие закрытия модалки
	 */
	'close-modal': null;

	/**
	 * Событие закрытия окна успеха
	 */
	'close-success': null;

	/**
	 * Событие обновления текущего продукта
	 */
	'current-product-updated': null;

	/**
	 * Событие открытия корзины
	 */
	'open-basket': null;

	/**
	 * Событие открытия формы контактов
	 */
	'open-contacts-form': null;

	/**
	 * Событие открытия формы заказа
	 */
	'open-order-form': null;

	/**
	 * Событие открытия продукта
	 * @param id - идентификатор продукта
	 */
	'open-product': { id: string };

	/**
	 * Событие открытия окна успеха
	 */
	'open-success': null;

	/**
	 * Событие обновления поля заказа
	 * @param field - поле заказа
	 * @param value - новое значение поля
	 */
	'order-field:input': { field: keyof IOrder; value: any };

	/**
	 * Событие обновления заказа
	 */
	'order-updated': null;

	/**
	 * Событие обновления ошибок заказа
	 */
	'order-errors-updated': null;

	/**
	 * Событие обновления списка продуктов
	 */
	'product-list-updated': null;

	/**
	 * Событие удаления продукта из корзины
	 * @param id - идентификатор продукта
	 */
	'remove-from-cart': { id: string };

	/**
	 * Событие переключения активного продукта
	 */
	'toggle-active-product': null;

	/**
	 * Событие отправки формы контактов
	 */
	'submit:contacts': null;
} & { [K in `order-updated:${keyof IOrder}`]: { value: unknown } };

export interface IEventEmitter {
	on<TEventKey extends keyof EmitterEvent>(
		event: TEventKey,
		callback: (data: EmitterEvent[TEventKey]) => void
	): void;
	emit<TEventKey extends keyof EmitterEvent>(
		event: TEventKey,
		data?: EmitterEvent[TEventKey]
	): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
