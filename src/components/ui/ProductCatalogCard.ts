import { IAppState } from '../../types/IAppState';
import { ProductCard } from './ProductCard';
import { IProductItem } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ProductCatalogCard extends ProductCard {
	constructor(appState: IAppState, value: IProductItem) {
		super(ensureElement<HTMLTemplateElement>('#card-catalog'), appState, value);

		this.element.addEventListener('click', () => {
			this.appState.setCurrentProduct(this.value);
		});
		this.update();
	}
}
