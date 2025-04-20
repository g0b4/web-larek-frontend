import { IAppState } from '../../types/IAppState';
import { IProductItem } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class ProductBasketCard extends Component {
	protected indexElement: HTMLElement;
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected removeButton: HTMLButtonElement;
	protected value: IProductItem;
	protected index: number;

	constructor(appState: IAppState, value: IProductItem, index: number) {
		super(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')),
			appState
		);
		this.value = value;
		this.index = index;
		this.indexElement = ensureElement('.basket__item-index', this.element);
		this.titleElement = ensureElement('.card__title', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
		this.removeButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		this.removeButton.addEventListener('click', () => {
			this.appState.removeFromCart(this.value);
		});
		this.update();
	}

	update() {
		this.indexElement.textContent = String(this.index + 1);
		this.titleElement.textContent = this.value.title;
		this.priceElement.textContent = Intl.NumberFormat('ru-RU').format(
			this.value.price
		) + ' синапсов';
	}
}
