import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { ProductWithImageCard } from './ProductWithImageCard';

export class ProductPreviewCard extends ProductWithImageCard {
	/**
	 * Кнопка добавления в корзину или удаления из корзины
	 */
	protected cardButton: HTMLButtonElement;
	/**
	 * Элемент с текстом описания продукта
	 */
	protected cardTextElement: HTMLElement;
	/**
	 * Родительский контейнер, в котором будет отображаться модальное окно
	 */
	protected modalContainer: HTMLElement;

	/**
	 * Конструктор компонента предпросмотра продукта
	 * @param element - HTML-элемент, в котором будет отображаться компонент
	 * @param eventEmitter - объект для отправки событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.modalContainer = ensureElement('#modal-container', document.body);
		this.categoryTitleElement.classList.remove('card__category_other');
		this.cardTextElement = ensureElement('.card__text', this.element);
		this.cardButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.element
		);
		this.cardButton.addEventListener('click', () => {
			this.eventEmitter.emit('toggle-active-product');
		});
	}

	/**
	 * Обновляет данные компонента
	 * @param value - данные продукта
	 * @param isInCart - флаг, является ли продукт в корзине
	 */
	update(value: IProductItem, isInCart?: boolean) {
		super.update(value);
		this.cardTextElement.textContent = value.description;
		this.updateButtonText(isInCart);
	}

	/**
	 * Обновляет текст кнопки добавления в корзину/удаления из корзины
	 * @param isInCart - флаг, является ли продукт в корзине
	 */
	updateButtonText(isInCart: boolean) {
		this.cardButton.textContent = isInCart
			? 'Удалить из корзины'
			: 'Добавить в корзину';
	}
}

