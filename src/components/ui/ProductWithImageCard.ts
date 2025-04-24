import { IProductItem, ProductItemCategory } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import { bem, ensureElement, setElementData } from '../../utils/utils';
import { ProductCard } from './ProductCard';

export abstract class ProductWithImageCard extends ProductCard {
	/**
	 * Элемент-картинка
	 */
	protected imageElement?: HTMLImageElement;

	/**
	 * Элемент заголовка категории
	 */
	protected categoryTitleElement: HTMLElement;

	/**
	 * Map, который переводит тип категории в CSS-класс
	 */
	protected categoryClassMap: Record<ProductItemCategory, string> = {
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	/**
	 * @param element - HTML-элемент, содержащий компонент
	 * @param eventEmitter - эмиттер событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.imageElement = ensureElement<HTMLImageElement>(
			'.card__image',
			this.element
		);
		this.categoryTitleElement = ensureElement('.card__category', this.element);
		this.categoryTitleElement.classList.remove;
	}

	/**
	 * Обновляет информацию о продукте
	 * @param value - обновленная информация о продукте
	 */
	update(value: IProductItem) {
		super.update(value);
		setElementData(this.element, { id: value.id });
		this.imageElement.src = resolveImageUrl(value.image);
		this.categoryTitleElement.textContent = value.category;
		this.categoryTitleElement.className = 'card__category';
		this.categoryTitleElement.classList.add(
			bem('card', 'category', this.categoryClassMap[value.category]).name
		);
	}
}
