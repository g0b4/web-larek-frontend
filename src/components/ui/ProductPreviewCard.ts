import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { ProductWithImageCard } from './ProductWithImageCard';

export class ProductPreviewCard extends ProductWithImageCard {
	protected cardButton: HTMLButtonElement;
	protected cardTextElement: HTMLElement;
	protected modalContainer: HTMLElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.modalContainer = ensureElement('#modal-container', document.body);
		this.categoryTitleElement.classList.remove('card__category_other');
		this.cardTextElement = ensureElement('.card__text', this.element);
		this.cardButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		this.cardButton.addEventListener('click', () => {
			this.eventEmitter.emit('select-product');
		});
	}

	update(value: IProductItem, isInCart?: boolean) {
		super.update(value);
		this.cardTextElement.textContent = value.description;
		this.updateButtonText(isInCart);
	}

	updateButtonText(isInCart: boolean) {
		this.cardButton.textContent = isInCart
			? 'Удалить из корзины'
			: 'Добавить в корзину';
	}
}
