import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';

import { Component } from './Component';

export class BasketComponent extends Component {
	protected listElement: HTMLElement;
	protected totalPriceElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.listElement = ensureElement('.basket__list', this.element);
		this.totalPriceElement = ensureElement('.basket__price', this.element);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.element
		);
		this.buttonElement.addEventListener('click', () => {
			this.eventEmitter.emit('open-order-form');
		});
	}

	updateContent(elements: HTMLElement[]) {
		this.listElement.innerHTML = '';
		this.listElement.append(...elements);
	}
	updateTotal(value: number) {
		this.totalPriceElement.textContent =
			new Intl.NumberFormat('ru-RU').format(value) + ' синапсов';
	}
}
