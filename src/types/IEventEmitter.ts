import { IOrder } from './IOrder';

// типизация названий событий для удобства
export type EmitterEvent = {
	'active-product-updated': null;
	'close-modal': null;
	'close-success': null;
	'current-product-updated': null;
	'open-basket': null;
	'open-contacts-form': null;
	'open-order-form': null;
	'open-product': { id: string };
	'open-success': null;
	'order-field:input': { field: keyof IOrder; value: any };
	'order-updated': null;
	'order-errors-updated': null;
	'product-list-updated': null;
	'remove-from-cart': { id: string };
	'select-product': null;
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
