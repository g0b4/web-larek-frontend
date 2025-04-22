import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class PageComponent extends Component {
	private cartCounterElement: HTMLElement;
	private headerBasketButton: HTMLButtonElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.cartCounterElement = ensureElement(
			'.header__basket-counter',
			this.element
		);
		this.headerBasketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.element
		);
		ensureAllElements('.modal', this.element).forEach((modal) => {
			modal.classList.remove('modal_active');
		});
		this.headerBasketButton.addEventListener('click', () => {
			// this.appState.openBasket();
			this.eventEmitter.emit('open-basket');
		});
		// this.appState.order.eventEmitter.on('updated:total', () => {
		// 	this.update();
		// });
	}

	updateCounter(value: number) {
		this.cartCounterElement.textContent = value.toString();
	}
}
