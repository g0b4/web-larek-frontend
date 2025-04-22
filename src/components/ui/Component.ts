import { IEventEmitter } from '../../types/IEventEmitter';

export abstract class Component {
	protected element: HTMLElement;
	protected eventEmitter: IEventEmitter;
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		this.element = element;
		this.eventEmitter = eventEmitter;
	}
	getElement() {
		return this.element;
	}
}
