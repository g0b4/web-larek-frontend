import { IProductItem } from '../../types';
import { IAppState } from '../../types/IAppState';
import { ensureElement } from '../../utils/utils';
import { ProductCard } from './ProductCard';

export class ProductPreviewCard extends ProductCard {
	protected cardButton: HTMLButtonElement;
	protected cardTextElement: HTMLElement;
	constructor(appState: IAppState, value: IProductItem) {
		super(ensureElement<HTMLTemplateElement>('#card-preview'), appState, value);
		this.categoryTitleElement.classList.remove('card__category_other');
		this.cardTextElement = ensureElement('.card__text', this.element);
		this.cardButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		this.cardButton.addEventListener('click', () => {
			if (this.appState.isInCart(this.appState.currentProduct)) {
				this.appState.removeFromCart(this.appState.currentProduct);
			} else {
				this.appState.addToCart(this.appState.currentProduct);
			}
			this.update();
		});
		this.appState.eventEmitter.on('current-product-updated', () => {
			this.update();
		});
		this.update();
	}

	update() {
		super.update();
		this.cardTextElement.textContent = this.appState.currentProduct.description;
		this.cardButton.textContent = this.appState.isInCart(
			this.appState.currentProduct
		)
			? 'Удалить из корзины'
			: 'Добавить в корзину';
	}
}
