import {
	basketComponent,
	contactsFormComponent,
	orderFormComponent,
	successComponent,
} from '../../components';
import { IAppState } from '../../types/IAppState';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';
import { ProductPreviewCard } from './ProductPreviewCard';

export class ModalComponent extends Component {
	private contentElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor(element: HTMLElement, appState: IAppState) {
		super(element, appState);

		this.contentElement = ensureElement<HTMLButtonElement>(
			'.modal__content',
			this.element
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.element
		);
		this.closeButton.addEventListener('click', () => {
			this.onCloseClick();
		});
		this.element.addEventListener('click', (e) => {
			if (e.target === this.element) {
				this.onCloseClick();
			}
		});

		this.appState.eventEmitter.on('current-product-updated', () => {
			if (this.appState.currentProduct) {
				this.render(
					new ProductPreviewCard(this.appState, this.appState.currentProduct)
				);
			} else {
				this.clear();
				this.close();
			}
		});

		this.appState.eventEmitter.on('open-basket', () => {
			this.render(basketComponent);
		});

		this.appState.eventEmitter.on('open-order-form', () => {
			this.render(orderFormComponent);
		});
		this.appState.eventEmitter.on('open-contacts-form', () => {
			this.render(contactsFormComponent);
		});

		this.appState.eventEmitter.on('open-success', () => {
			this.render(successComponent);
		});
		this.appState.eventEmitter.on('close-success', () => {
			this.onCloseClick();
		});
	}
	render(component: Component) {
		this.clear();
		this.contentElement.append(component.getElement());
		this.open();
	}
	onCloseClick() {
		this.appState.eventEmitter.emit('close-modal');
		this.clear();
		this.close();
	}
	clear() {
		this.contentElement.innerHTML = '';
	}
	open() {
		this.element.classList.add('modal_active');
	}
	close() {
		this.element.classList.remove('modal_active');
	}
}
