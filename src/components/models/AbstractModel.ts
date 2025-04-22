import { IEventEmitter } from '../../types/IEventEmitter';

export abstract class AbstractModel<T> {
	value: T;
	eventEmitter: IEventEmitter;
	abstract reset(): void;
	setValue(value: T) {
		this.value = value;
	}
	constructor(eventEmitter: IEventEmitter) {
		this.eventEmitter = eventEmitter;
		this.reset();
	}
}
