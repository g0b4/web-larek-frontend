import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { ProductCard } from './ProductCard';

export class ProductBasketCard extends ProductCard {
	protected indexElement: HTMLElement;
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;
	protected removeButton: HTMLButtonElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.indexElement = ensureElement('.basket__item-index', this.element);
		this.titleElement = ensureElement('.card__title', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
		this.removeButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		this.removeButton.addEventListener('click', () => {
			this.eventEmitter.emit('remove-from-cart', {
				id: this.id,
			});
		});
	}

	update(value: IProductItem, index?: number) {
		super.update(value);
		this.indexElement.textContent = String(index + 1);
		this.titleElement.textContent = value.title;
		this.priceElement.textContent =
			Intl.NumberFormat('ru-RU').format(value.price) + ' синапсов';
	}
}
