import { IAppState } from '../../types/IAppState';
import { Component } from './Component';
import { ProductCatalogCard } from './ProductCatalogCard';

export class ProductGallery extends Component {
	constructor(element: HTMLElement, appState: IAppState) {
		super(element, appState);
		this.appState.eventEmitter.on('products-updated', () => {
			this.update();
		});
	}

	update() {
		this.element.innerHTML = '';
		this.appState.productList.forEach((item) => {
			this.element.append(
				new ProductCatalogCard(this.appState, item).getElement()
			);
		});
	}
}
