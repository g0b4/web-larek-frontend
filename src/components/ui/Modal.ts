import { BaseComponent, IComponent } from './BaseComponent';

export class Modal extends BaseComponent {
	constructor() {
		super();
		this.element = document.querySelector('#modal-container');
		const hideAndClear = () => {
			this.hide();
			this.clear();
		};
		this.element
			.querySelector('.modal__close')
			.addEventListener('click', hideAndClear);
		this.element.addEventListener('click', (e) => {
			if (e.target === this.element) {
				hideAndClear();
			}
		});
	}
	append(component: IComponent) {
		this.element.querySelector('.modal__content').append(component.element);
		return this;
	}
	clear() {
		this.element.querySelector('.modal__content').innerHTML = '';
		return this;
	}
	show() {
		this.element.classList.add('modal_active');
		return this;
	}
	hide() {
		this.element;
		this.emit('hide');
		this.element.classList.remove('modal_active');
		return this;
	}
}
