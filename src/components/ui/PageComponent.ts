import { IAppState } from '../../types/IAppState';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class PageComponent extends Component {
	private cartCounterElement: HTMLElement;
	private headerBasketButton: HTMLButtonElement;

	constructor(element: HTMLElement, appState: IAppState) {
		super(element, appState);

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
			this.appState.openBasket();
		});
		this.appState.order.eventEmitter.on('updated:total', () => {
			this.update();
		});
	}

	update() {
		this.cartCounterElement.textContent =
			this.appState.order.value.items.length.toString();
	}
}
