import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { ProductWithImageCard } from './ProductWithImageCard';

export class ProductCatalogCard extends ProductWithImageCard {
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.element.addEventListener('click', () => {
			eventEmitter.emit('open-product', {
				id: this.id,
			});
		});
	}

	update(value: IProductItem): void {
		super.update(value);
	}
}
