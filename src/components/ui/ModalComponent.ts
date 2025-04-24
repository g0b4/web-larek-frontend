import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

/**
 * Компонент модального окна.
 */
export class ModalComponent extends Component {
	private contentElement: HTMLElement;
	private closeButton: HTMLButtonElement;

	/**
	 * Создаёт экземпляр ModalComponent.
	 * @param element - HTML элемент модального окна.
	 * @param eventEmitter - Эмиттер событий.
	 */
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

	/**
	 * Отображает переданный элемент внутри модального окна.
	 * @param element - HTML элемент для отображения.
	 */
	render(element: HTMLElement) {
		this.clear();
		this.contentElement.append(element);
		this.open();
	}

	/**
	 * Обработчик события закрытия модального окна.
	 */
	onCloseClick() {
		this.eventEmitter.emit('close-modal');
		this.clear();
		this.close();
	}

	/**
	 * Очищает содержимое модального окна.
	 */
	clear() {
		this.contentElement.innerHTML = '';
	}

	/**
	 * Открывает модальное окно.
	 */
	open() {
		this.element.classList.add('modal_active');
	}

	/**
	 * Закрывает модальное окно.
	 */
	close() {
		this.element.classList.remove('modal_active');
	}
}

