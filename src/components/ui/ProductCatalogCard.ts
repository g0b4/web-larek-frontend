import { IProductItem } from '../../types';
import { categoryClassMap } from '../../utils/categoryClassMap';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { bem, ensureElement } from '../../utils/utils';
import { BaseComponent } from './BaseComponent';

export class ProductCatalogCard extends BaseComponent {
	constructor(value: IProductItem) {
		super();
		this.setTemplate(ensureElement<HTMLTemplateElement>('#card-catalog'));

		this.element.querySelector('.card__category').textContent = value.category;
		this.element
			.querySelector('.card__category')
			.classList.add(
				bem('card', 'category', categoryClassMap[value.category]).name
			);
		this.element.querySelector('.card__title').textContent = value.title;
		this.element.querySelector<HTMLImageElement>('.card__image').src =
			resolveImageUrl(value.image);
		this.element.querySelector('.card__price').textContent =
			Intl.NumberFormat('ru-RU').format(value.price) + ' синапсов';

		this.element.addEventListener('click', () => {
			this.eventEmitter.emit('click', value);
		});
	}
}
