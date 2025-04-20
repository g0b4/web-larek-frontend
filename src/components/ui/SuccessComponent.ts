import { IAppState } from '../../types/IAppState';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class SuccessComponent extends Component {
	protected descriptionElement: HTMLElement;
	protected closeButton: HTMLElement;

	constructor(appState: IAppState) {
		super(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
			appState
		);

		this.descriptionElement = ensureElement(
			'.order-success__description',
			this.element
		);
		this.closeButton = ensureElement('.order-success__close', this.element);
		this.closeButton.addEventListener('click', () => {
			appState.closeSuccess();
		});
		this.appState.eventEmitter.on('after-submit', () => {
			this.update();
		});
		this.update();
	}

	update() {
		this.descriptionElement.textContent = `Списано ${this.appState.lastOrderTotal} синапсов`;
	}
}
