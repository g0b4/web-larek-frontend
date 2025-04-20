import { IAppState } from '../../types/IAppState';
import { IProductItem } from '../../types';
import { categoryClassMap } from '../../utils/categoryClassMap';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { cloneTemplate, ensureElement, bem } from '../../utils/utils';
import { Component } from './Component';

export abstract class ProductCard extends Component {
	protected titleElement: HTMLElement;
	protected imageElement?: HTMLImageElement;
	protected priceElement: HTMLElement;
	protected categoryTitleElement: HTMLElement;
	protected value: IProductItem | null;

	constructor(
		template: HTMLTemplateElement,
		appState: IAppState,
		value: IProductItem
	) {
		super(cloneTemplate(template), appState);
		this.value = value;
		this.titleElement = ensureElement('.card__title', this.element);
		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.element
		);
		this.priceElement = ensureElement('.card__price', this.element);
		this.categoryTitleElement = ensureElement('.card__category', this.element);
	}

	update() {
		if (!this.value) return;
		this.titleElement.textContent = this.value.title;
		this.imageElement.src = resolveImageUrl(this.value.image);
		this.priceElement.textContent =
			Intl.NumberFormat('ru-RU').format(this.value.price) + ' синапсов';

		this.categoryTitleElement.textContent = this.value.category;
		this.categoryTitleElement.classList.add(
			bem('card', 'category', categoryClassMap[this.value.category]).name
		);
	}
}
