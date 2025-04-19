import { IProductItem } from '../../types';
import { ensureElement } from '../../utils/utils';
import { BaseComponent } from './BaseComponent';

export class ProductBasketCard extends BaseComponent {
	value?: { item: IProductItem; index: number };

	constructor(value: { item: IProductItem; index: number }) {
		super();
		this.value = value;
		this.setTemplate(ensureElement<HTMLTemplateElement>('#card-basket'));

		this.element.querySelector('.basket__item-index').textContent =
			value.index.toString();
		this.element.querySelector('.card__title').textContent = value.item.title;

		this.element.querySelector('.card__price').textContent =
			Intl.NumberFormat('ru-RU').format(value.item.price) + ' синапсов';

		this.element
			.querySelector('.card__button')
			.addEventListener('click', () => {
				this.eventEmitter.emit('delete', value.item);
			});
	}
}
