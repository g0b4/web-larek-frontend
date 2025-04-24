import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { ProductWithImageCard } from './ProductWithImageCard';

/**
 * Компонент карточки товара в каталоге.
 * @class ProductCatalogCard
 * @extends {ProductWithImageCard}
 */
export class ProductCatalogCard extends ProductWithImageCard {
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		/**
		 * Слушатель события клика на карточку.
		 * @listens Event:open-product
		 */
		this.element.addEventListener('click', () => {
			eventEmitter.emit('open-product', {
				id: this.id,
			});
		});
	}

	/**
	 * Обновляет информацию о продукте в карточке.
	 * @param {IProductItem} value - обновленная информация о продукте
	 */
	update(value: IProductItem): void {
		super.update(value);
	}
}

