import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class ModalComponent extends Component {
	private contentElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

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
	}
	render(element: HTMLElement) {
		this.clear();
		this.contentElement.append(element);
		this.open();
	}
	onCloseClick() {
		this.eventEmitter.emit('close-modal');
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
