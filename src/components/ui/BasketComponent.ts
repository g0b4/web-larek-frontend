import { IAppState } from '../../types/IAppState';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from './Component';
import { ProductBasketCard } from './ProductBasketCard';

export class BasketComponent extends Component {
	protected listElement: HTMLElement;
	protected totalPriceElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(appState: IAppState) {
		super(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')),
			appState
		);

		this.listElement = ensureElement('.basket__list', this.element);
		this.totalPriceElement = ensureElement('.basket__price', this.element);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.element
		);
		this.buttonElement.addEventListener('click', () => {
			this.appState.openOrderForm();
		});
		this.appState.order.eventEmitter.on('updated:total', () => {
			this.update();
		});
		this.update();
	}

	update() {
		this.listElement.innerHTML = '';
		this.totalPriceElement.textContent = '0';
		Array.from(this.appState.order.value.items.values()).forEach(
			(item, index) => {
				this.listElement.append(
					new ProductBasketCard(this.appState, item, index).getElement()
				);
				this.totalPriceElement.textContent =
					new Intl.NumberFormat('ru-RU').format(
						this.appState.order.value.total
					) + ' синапсов';
			}
		);
	}
}
