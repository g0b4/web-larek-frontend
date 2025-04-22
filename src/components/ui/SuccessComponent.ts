import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class SuccessComponent extends Component {
	protected descriptionElement: HTMLElement;
	protected closeButton: HTMLElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.descriptionElement = ensureElement(
			'.order-success__description',
			this.element
		);
		this.closeButton = ensureElement('.order-success__close', this.element);
		this.closeButton.addEventListener('click', () => {
			this.eventEmitter.emit('close-success');
		});
	}

	updateTotal(value: number) {
		this.descriptionElement.textContent = `Списано ${value} синапсов`;
	}
}
