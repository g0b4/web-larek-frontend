import { Component } from './Component';

export class ProductGallery extends Component {
	updateContent(list: HTMLElement[]) {
		this.element.innerHTML = '';
		this.element.append(...list);
	}
}
