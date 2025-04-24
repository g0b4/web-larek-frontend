import { Component } from './Component';

/**
 * Компонент галереи продуктов
 *
 * @class ProductGallery
 * @extends {Component}
 */
export class ProductGallery extends Component {
	/**
	 * Обновляет содержимое галереи
	 *
	 * @param {HTMLElement[]} list - Список элементов для отображения
	 * @memberof ProductGallery
	 */
	updateContent(list: HTMLElement[]) {
		this.element.innerHTML = '';
		this.element.append(...list);
	}
}
