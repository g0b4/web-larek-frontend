import { IProductItem } from '../../types';
import { categoryClassMap } from '../../utils/categoryClassMap';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { bem, ensureElement } from '../../utils/utils';
import { cartStore } from '../cartStore';
import { BaseComponent } from './BaseComponent';

export class ProductPreviewCard extends BaseComponent {
	value?: IProductItem;
	refresh() {
		const buttonText = cartStore.get(this.value.id)
			? 'Удалить из корзины'
			: 'В корзину';
		this.element.querySelector('.card__button').textContent = buttonText;
	}
	constructor(value: IProductItem) {
		super();
		this.value = value;
		this.setTemplate(ensureElement<HTMLTemplateElement>('#card-preview'));

		this.refresh();
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

		this.element
			.querySelector('.card__button')
			.addEventListener('click', () => {
				cartStore.get(value.id)
					? cartStore.delete(value.id)
					: cartStore.set(value.id, value);
				this.eventEmitter.emit('update-cart')
				this.refresh();
			});
	}
}
