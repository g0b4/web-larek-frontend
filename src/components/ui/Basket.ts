import { IProductItem } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { cartStore } from '../cartStore';
import { BaseComponent } from './BaseComponent';
import { ProductBasketCard } from './ProductBasketCard';

export class Basket extends BaseComponent {
	value: IProductItem[] = [];
	refresh() {
		this.value = Array.from(cartStore.values());
		this.element.querySelector('.basket__list').innerHTML = '';
		this.element.querySelector('.basket__list').append(
			...this.value.map((item, index) => {
				const productBasketCard = new ProductBasketCard({ item, index });
				productBasketCard.eventEmitter.on('delete', (item: IProductItem) => {
					this.eventEmitter.emit('delete-item', item);
					cartStore.delete(item.id);
					this.refresh();
				});
				return createElement('li', {}, [productBasketCard.element]);
			})
		);

		this.element.querySelector('.basket__price').textContent =
			this.value.reduce((acc, item) => acc + item.price, 0) + ' синапсов';
	}
	constructor() {
		super();
		this.setTemplate(ensureElement<HTMLTemplateElement>('#basket'));
		this.refresh();

		this.element
			.querySelector('.basket__button')
			.addEventListener('click', () => {
				this.eventEmitter.emit('submit');
			});
	}
}
