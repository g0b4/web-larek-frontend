import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

/**
 * Компонент формы контактов
 * @class ContactsFormComponent
 * @extends {Component}
 */
export class ContactsFormComponent extends Component {
	/**
	 * Кнопка отправки формы
	 * @type {HTMLButtonElement}
	 */
	submitButton: HTMLButtonElement;
	/**
	 * Поле ввода email
	 * @type {HTMLInputElement}
	 */
	emailInput: HTMLInputElement;
	/**
	 * Поле ввода телефона
	 * @type {HTMLInputElement}
	 */
	phoneInput: HTMLInputElement;
	/**
	 * Элемент, содержащий ошибки валидации
	 * @type {HTMLElement}
	 */
	errorsElement: HTMLElement;

	/**
	 * Creates an instance of ContactsFormComponent.
	 * @param {HTMLElement} element - Элемент, содержащий форму
	 * @param {IEventEmitter} eventEmitter - Эмиттер событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.element
		);
		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.element
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.element
		);

		this.emailInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'email',
				value: (e.target as HTMLInputElement).value,
			});
		});
		this.phoneInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'phone',
				value: (e.target as HTMLInputElement).value,
			});
		});

		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.eventEmitter.emit('submit:contacts');
		});
	}

	/**
	 * Обновляет значение поля телефона
	 * @param {string} value - Новое значение поля телефона
	 */
	updatePhone(value: string) {
		this.emailInput.value = value;
	}
	/**
	 * Обновляет значение поля email
	 * @param {string} value - Новое значение поля email
	 */
	updateEmail(value: string) {
		this.phoneInput.value = value;
	}
	/**
	 * Обновляет состояние кнопки отправки формы
	 * @param {{ disabled: boolean }} - Объект с состоянием кнопки
	 */
	updateSubmitButtonState({ disabled }: { disabled: boolean }) {
		this.submitButton.disabled = disabled;
	}
	/**
	 * Обновляет ошибки валидации
	 * @param {string[]} errors - Массив ошибок валидации
	 */
	updateErrors(errors: string[]) {
		this.errorsElement.innerHTML = errors
			.map((error) => `<p>${error}</p>`)
			.join('');
	}
}

